/* Deadlock Challenge Room — v0.5
   Local rooms work in the same browser profile. Cross-device rooms need Supabase.
*/
const SUPABASE_URL = ""; // https://YOUR-PROJECT.supabase.co
const SUPABASE_ANON_KEY = ""; // public anon key
const $ = (id) => document.getElementById(id);
const challenges = {
  easy: [
    ["БЕЗ ПАНИКИ","Не покупай активные предметы в этом матче."],
    ["ТИХИЙ СТАРТ","Первые 8 минут не используй голосовой чат."],
    ["ОДНА ЦЕЛЬ","До 10-й минуты не меняй выбранную линию."],
    ["ЭКОНОМИЯ","Не покупай предметы дороже 1 250 душ до 12-й минуты."],
    ["ПОМОЩНИК","Каждую доступную возможность помогать союзнику — используй."]
  ],
  normal: [
    ["НЕУДОБНЫЙ БИЛД","Купи один предмет из категории, которую обычно игнорируешь."],
    ["ОХОТНИК","Сделай минимум 3 успешных ганга до 15-й минуты."],
    ["БЕЗ ПОВТОРОВ","Не покупай один и тот же тип предметов дважды подряд."],
    ["НА РИСКЕ","Каждый раз после смерти меняй следующий маршрут."],
    ["КОМАНДНЫЙ ИГРОК","До конца матча участвуй минимум в 3 командных драках."]
  ],
  hard: [
    ["БЕЗ КОМФОРТА","Не покупай предметы, которые входят в твой стандартный билд."],
    ["РУКИ СВЯЗАНЫ","До 10-й минуты не покупай ботинки."],
    ["НА ЧУВСТВЕ","Не открывай магазин во время матча дольше 5 секунд за раз."],
    ["ОХОТА НА БОССА","Будь инициатором хотя бы одной попытки забрать Mid Boss."],
    ["ОДИН ШАНС","После первой смерти играй следующие 5 минут без покупок."]
  ]
};
const state = { room:null, player:null, difficulty:"easy", picked:null, rerolls:1, revealed:false, channel:null, poll:null, supabase:null, online:false };
let toastTimer;
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function code(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function getRooms(){try{return JSON.parse(localStorage.getItem("dc_rooms")||"{}")}catch{return {}}}
function saveRooms(r){localStorage.setItem("dc_rooms",JSON.stringify(r))}
function getRoom(){return state.room?getRooms()[state.room]:null}
function saveRoom(room){const all=getRooms();all[room.code]=room;saveRooms(all);localStorage.setItem("dc_last_room",room.code);if(state.channel)state.channel.postMessage({type:"update",room})}
function setupChannel(){if(state.channel)state.channel.close();if("BroadcastChannel"in window){state.channel=new BroadcastChannel("deadlock-challenge-room");state.channel.onmessage=e=>{if(e.data?.room?.code===state.room){const all=getRooms();all[state.room]=e.data.room;saveRooms(all);renderRoom(e.data.room)}}}}
function initSupabase(){if(!SUPABASE_URL||!SUPABASE_ANON_KEY)return null;return null /* Optional online adapter can be added after project credentials are supplied. */}
function enterRoom(room,player,online=false){state.room=room.code;state.player=player;state.online=online;state.picked=null;state.rerolls=1;state.revealed=false;setupChannel();$("roomSection").hidden=true;$("gameSection").hidden=false;$("activeRoomCode").textContent=room.code;$("roomMode").textContent=online?"ONLINE ROOM":"LOCAL ROOM";$("connectionState").innerHTML="<i></i> "+(online?"ONLINE":"LOCAL MODE");renderRoom(room);$("gameSection").scrollIntoView({behavior:"smooth",block:"start"})}
function createRoom(){const room={code:code(),created:Date.now(),players:[{name:"ИГРОК 1",difficulty:"easy",pick:null,rerolls:1},{name:null,difficulty:"easy",pick:null,rerolls:1}],revealed:false};saveRoom(room);enterRoom(room,0);toast("КОМНАТА СОЗДАНА — ОТПРАВЬ КОД НАПАРНИКУ")}
function joinRoom(){const c=$("roomCodeInput").value.trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(c)){toast("ВВЕДИ 6-СИМВОЛЬНЫЙ КОД");return}const room=getRooms()[c];if(!room){toast("КОМНАТА НЕ НАЙДЕНА В ЭТОМ БРАУЗЕРЕ");return}if(room.players[1].name){toast("В КОМНАТЕ УЖЕ ЕСТЬ ДВА ИГРОКА");return}room.players[1].name="ИГРОК 2";saveRoom(room);enterRoom(room,1)}
function updateRoom(mutator){const room=getRoom();if(!room)return;mutator(room);room.revealed=!!(room.players[0].pick&&room.players[1].pick);saveRoom(room);renderRoom(room)}
function renderRoom(room){if(!room)return;$("playerOneName").textContent=room.players[0].name||"ОЖИДАНИЕ";$("playerTwoName").textContent=room.players[1].name||"ОЖИДАНИЕ";$("playerOneState").textContent=room.players[0].pick?"ВЫБОР ЗАФИКСИРОВАН":"ВЫБИРАЕТ...";$("playerTwoState").textContent=room.players[1].pick?"ВЫБОР ЗАФИКСИРОВАН":(room.players[1].name?"ВЫБИРАЕТ...":"ОЖИДАЕМ ИГРОКА");$("revealStatus").textContent=room.revealed?"ОБЕ КАРТЫ ОТКРЫТЫ":"ОЖИДАЕМ ОБОИХ ИГРОКОВ";if(room.revealed){[0,1].forEach(i=>{const p=room.players[i].pick;$("reveal"+(i?"Two":"One")+"Title").textContent=p.title;$("reveal"+(i?"Two":"One")+"Text").textContent=p.text;$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.add("revealed")})}else{[0,1].forEach(i=>{$("reveal"+(i?"Two":"One")+"Title").textContent="???";$("reveal"+(i?"Two":"One")+"Text").textContent="Карты пока закрыты.";$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.remove("revealed")})}const mine=room.players[state.player];state.picked=mine.pick;state.rerolls=mine.rerolls;$("rerollChallenge").disabled=!mine.pick||mine.rerolls<=0;$("rerollChallenge").querySelector("span").textContent=mine.rerolls+"/1";if(mine.pick){$("drawCard").innerHTML=`<span class="draw-card-index">CARD / ${mine.pick.id}</span><strong>${mine.pick.title}</strong><small>${mine.pick.text}</small>`;$("drawChallenge").textContent="ВЫБОР ЗАФИКСИРОВАН";$("drawChallenge").disabled=true}else{$("drawCard").innerHTML='<span class="draw-card-index">CARD / 000</span><strong>ГОТОВ<br>К ВЫТЯГИВАНИЮ?</strong><small>НАЖМИ КНОПКУ НИЖЕ</small>';$("drawChallenge").textContent="ВЫТЯНУТЬ КАРТУ ↗";$("drawChallenge").disabled=false}document.querySelectorAll(".difficulty").forEach(b=>b.classList.toggle("active",b.dataset.difficulty===mine.difficulty))}
function draw(reroll=false){const room=getRoom();if(!room)return;const me=room.players[state.player];if(me.pick&&!reroll)return;if(reroll&&me.rerolls<=0)return;const pool=challenges[me.difficulty];let item=pool[Math.floor(Math.random()*pool.length)];if(reroll&&pool.length>1&&me.pick){while(item[0]===me.pick.title)item=pool[Math.floor(Math.random()*pool.length)]}me.pick={id:String(Math.floor(100+Math.random()*900)),title:item[0],text:item[1]};if(reroll)me.rerolls--;saveRoom(room);renderRoom(room);toast(reroll?"КАРТА ПЕРЕБРОШЕНА":"КАРТА ВЫТЯНУТА — ЖДИ НАПАРНИКА")}
function setDifficulty(d){if(!state.room)return;updateRoom(r=>{r.players[state.player].difficulty=d});}
function leaveRoom(){if(state.channel)state.channel.close();if(state.poll)clearInterval(state.poll);state.room=null;state.player=null;$("gameSection").hidden=true;$("roomSection").hidden=false;$("roomCodeInput").value="";window.scrollTo({top:$("roomSection").offsetTop-30,behavior:"smooth"})}
$("createRoom").addEventListener("click",createRoom);$("openRoom").addEventListener("click",()=>$("roomSection").scrollIntoView({behavior:"smooth"}));$("joinRoom").addEventListener("click",joinRoom);$("roomCodeInput").addEventListener("keydown",e=>{if(e.key==="Enter")joinRoom()});$("drawChallenge").addEventListener("click",()=>draw(false));$("rerollChallenge").addEventListener("click",()=>draw(true));$("leaveRoom").addEventListener("click",leaveRoom);document.querySelectorAll(".difficulty").forEach(b=>b.addEventListener("click",()=>setDifficulty(b.dataset.difficulty)));$("menuBtn").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
if(!("BroadcastChannel"in window))$("connectionState").innerHTML="<i></i> SINGLE TAB MODE";
