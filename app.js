/* Deadlock Challenge Room — v0.5
   Local rooms work in the same browser profile. Cross-device rooms need Supabase.
*/
const SUPABASE_URL = ""; // https://YOUR-PROJECT.supabase.co
const SUPABASE_ANON_KEY = ""; // public anon key
const $ = (id) => document.getElementById(id);
const challenges = {
  easy: [
    ["БЕЗ ПАНИКИ","Не покупай активные предметы в этом матче.","items"],
    ["ТИХИЙ СТАРТ","Первые 8 минут не используй голосовой чат.","gameplay"],
    ["ОДНА ЦЕЛЬ","До 10-й минуты не меняй выбранную линию.","gameplay"],
    ["ЭКОНОМИЯ","Не покупай предметы дороже 1 250 душ до 12-й минуты.","items"],
    ["ПОМОЩНИК","Участвуй минимум в трёх командных действиях за матч.","gameplay"],
    ["НОВЫЙ ЛИЦО","Выбери героя, на котором давно не играл.","heroes"],
    ["БЕЗ ФАРМА","Первые 4 минуты не бей нейтральных крипов.","gameplay"],
    ["СМЕНА ПРИВЫЧЕК","Купи предмет, который обычно пропускаешь.","items"],
    ["ПЕРВЫЙ КОНТАКТ","Совершите первый ганги до 8-й минуты.","gameplay"],
    ["СЛУЧАЙНЫЙ ВЫБОР","Выбери героя случайным образом.","heroes"],
    ["НЕ СТОЙ","После каждой волны крипов смени позицию на карте.","chaos"],
    ["МИРНЫЙ РЕЖИМ","Не начинай драку первым до 10-й минуты.","chaos"]
  ],
  normal: [
    ["НЕУДОБНЫЙ БИЛД","Купи два предмета из категории, которую обычно игнорируешь.","items"],
    ["ОХОТНИК","Сделай минимум 3 успешных ганга до 15-й минуты.","gameplay"],
    ["БЕЗ ПОВТОРОВ","Не покупай один и тот же тип предметов дважды подряд.","items"],
    ["НА РИСКЕ","После каждой смерти меняй следующий маршрут.","chaos"],
    ["КОМАНДНЫЙ ИГРОК","Участвуй минимум в 5 командных драках за матч.","gameplay"],
    ["НЕЗНАКОМЕЦ","Выбери героя, на котором у тебя меньше всего часов.","heroes"],
    ["СБОРЩИК","Собери активный предмет и используй его по перезарядке.","items"],
    ["БЕЗ УЛЬТЫ","Не используй ультимейт первые 10 минут.","gameplay"],
    ["СМЕНА РОЛИ","Играй агрессивнее обычного и инициируй драки.","chaos"],
    ["ОХОТА ЗА ДУШАМИ","Сделай приоритетом контроль объектов, а не фарм.","gameplay"],
    ["НЕОЖИДАННЫЙ ПИК","Пусть напарник выберет тебе героя.","heroes"],
    ["ИНВЕНТАРЬ ХАОСА","Каждая следующая покупка должна быть из другой категории.","items"]
  ],
  hard: [
    ["БЕЗ КОМФОРТА","Не покупай предметы из своего стандартного билда.","items"],
    ["РУКИ СВЯЗАНЫ","До 10-й минуты не покупай ботинки.","items"],
    ["НА ЧУВСТВЕ","Не открывай магазин во время матча дольше 5 секунд за раз.","chaos"],
    ["ОХОТА НА БОССА","Будь инициатором хотя бы одной попытки забрать Mid Boss.","gameplay"],
    ["ОДИН ШАНС","После первой смерти играй следующие 5 минут без покупок.","chaos"],
    ["СЛОЖНЫЙ ГЕРОЙ","Выбери героя, на котором у тебя нет уверенной практики.","heroes"],
    ["БЕЗ ЗАЩИТЫ","Не покупай защитные предметы до 15-й минуты.","items"],
    ["ПЕРВЫЙ ВХОД","В каждой командной драке старайся начинать первым.","gameplay"],
    ["ПОЛНЫЙ ХАОС","Напарник выбирает тебе героя и первый большой предмет.","chaos"],
    ["НИКАКИХ ОТСТУПЛЕНИЙ","Не покидай линию до первого разрушенного объекта.","gameplay"],
    ["НЕ ТВОЙ СТИЛЬ","Играй на герое с совершенно другим стилем от привычного.","heroes"],
    ["ДОРОГОЙ ЭКСПЕРИМЕНТ","Собери необычный билд минимум из трёх нестандартных предметов.","items"]
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
function createRoom(){const room={code:code(),created:Date.now(),players:[{name:"ИГРОК 1",difficulty:"easy",pick:null,done:false},{name:null,difficulty:"easy",pick:null,done:false}],revealed:false};saveRoom(room);enterRoom(room,0);toast("КОМНАТА СОЗДАНА — ОТПРАВЬ КОД НАПАРНИКУ")}
function joinRoom(){const c=$("roomCodeInput").value.trim().toUpperCase();if(!/^[A-Z0-9]{6}$/.test(c)){toast("ВВЕДИ 6-СИМВОЛЬНЫЙ КОД");return}const room=getRooms()[c];if(!room){toast("КОМНАТА НЕ НАЙДЕНА В ЭТОМ БРАУЗЕРЕ");return}if(room.players[1].name){toast("В КОМНАТЕ УЖЕ ЕСТЬ ДВА ИГРОКА");return}room.players[1].name="ИГРОК 2";saveRoom(room);enterRoom(room,1)}
function updateRoom(mutator){const room=getRoom();if(!room)return;mutator(room);room.revealed=!!(room.players[0].pick&&room.players[1].pick);saveRoom(room);renderRoom(room)}
function renderRoom(room){if(!room)return;$("playerOneName").textContent=room.players[0].name||"ОЖИДАНИЕ";$("playerTwoName").textContent=room.players[1].name||"ОЖИДАНИЕ";$("playerOneState").textContent=room.players[0].pick?"ВЫБОР ЗАФИКСИРОВАН":"ВЫБИРАЕТ...";$("playerTwoState").textContent=room.players[1].pick?"ВЫБОР ЗАФИКСИРОВАН":(room.players[1].name?"ВЫБИРАЕТ...":"ОЖИДАЕМ ИГРОКА");$("revealStatus").textContent=room.revealed?"ОБЕ КАРТЫ ОТКРЫТЫ":"ОЖИДАЕМ ОБОИХ ИГРОКОВ";if(room.revealed){[0,1].forEach(i=>{const p=room.players[i].pick;$("reveal"+(i?"Two":"One")+"Title").textContent=p.title;$("reveal"+(i?"Two":"One")+"Text").textContent=p.text;$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.add("revealed")})}else{[0,1].forEach(i=>{$("reveal"+(i?"Two":"One")+"Title").textContent="???";$("reveal"+(i?"Two":"One")+"Text").textContent="Карты пока закрыты.";$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.remove("revealed")})}const mine=room.players[state.player];state.picked=mine.pick;state.rerolls=mine.rerolls;$("rerollChallenge").disabled=!mine.pick||mine.rerolls<=0;$("rerollChallenge").querySelector("span").textContent=mine.rerolls+"/1";if($("duoComplete")){$("duoComplete").disabled=!(room.revealed&&mine.pick&&!mine.done);$("duoComplete").textContent=mine.done?"✓ ТЫ ПОДТВЕРДИЛ ВЫПОЛНЕНИЕ":"✓ МОЁ ЗАДАНИЕ ВЫПОЛНЕНО"}if(mine.pick){$("drawCard").innerHTML=`<span class="draw-card-index">CARD / ${mine.pick.id}</span><strong>${mine.pick.title}</strong><small>${mine.pick.text}</small>`;$("drawChallenge").textContent="ВЫБОР ЗАФИКСИРОВАН";$("drawChallenge").disabled=true}else{$("drawCard").innerHTML='<span class="draw-card-index">CARD / 000</span><strong>ГОТОВ<br>К ВЫТЯГИВАНИЮ?</strong><small>НАЖМИ КНОПКУ НИЖЕ</small>';$("drawChallenge").textContent="ВЫТЯНУТЬ КАРТУ ↗";$("drawChallenge").disabled=false}document.querySelectorAll(".difficulty").forEach(b=>b.classList.toggle("active",b.dataset.difficulty===mine.difficulty))}
function draw(reroll=false){const room=getRoom();if(!room)return;const me=room.players[state.player];if(me.pick&&!reroll)return;if(reroll)return;const pool=challenges[me.difficulty];let item=pool[Math.floor(Math.random()*pool.length)];if(reroll&&pool.length>1&&me.pick){while(item[0]===me.pick.title)item=pool[Math.floor(Math.random()*pool.length)]}me.pick={id:String(Math.floor(100+Math.random()*900)),title:item[0],text:item[1]};room.revealed=!!(room.players[0].pick&&room.players[1].pick);saveRoom(room);renderRoom(room);toast(reroll?"КАРТА ПЕРЕБРОШЕНА":"КАРТА ВЫТЯНУТА — ЖДИ НАПАРНИКА")}
function setDifficulty(d){if(!state.room)return;updateRoom(r=>{r.players[state.player].difficulty=d});}

function duoComplete(){const room=getRoom();if(!room||!room.revealed)return;room.players[state.player].done=true;if(room.players[0].done&&room.players[1].done){room.players.forEach(p=>{p.pick=null;p.done=false;p.rerolls=1});room.revealed=false;saveRoom(room);renderRoom(room);toast("НОВЫЙ РАУНД — НОВЫЕ ИСПЫТАНИЯ")}else{saveRoom(room);renderRoom(room);toast("ГОТОВО! ЖДЁМ НАПАРНИКА")}}
function leaveRoom(){if(state.channel)state.channel.close();if(state.poll)clearInterval(state.poll);state.room=null;state.player=null;$("gameSection").hidden=true;$("roomSection").hidden=false;$("roomCodeInput").value="";window.scrollTo({top:$("roomSection").offsetTop-30,behavior:"smooth"})}

const soloState={difficulty:"easy",category:"all",round:1,current:null,used:[]};
function showMode(which){$("soloSection").hidden=which!=="solo";$("roomSection").hidden=which!=="duo";if(which==="solo")$("soloSection").scrollIntoView({behavior:"smooth",block:"start"});else $("roomSection").scrollIntoView({behavior:"smooth",block:"start"});}
function soloPick(){let pool=challenges[soloState.difficulty].filter(x=>soloState.category==="all"||x[2]===soloState.category);pool=pool.filter(x=>!soloState.used.includes(x[0]));if(!pool.length){soloState.used=[];pool=challenges[soloState.difficulty].filter(x=>soloState.category==="all"||x[2]===soloState.category)}const item=pool[Math.floor(Math.random()*pool.length)];soloState.current=item;soloState.used.push(item[0]);$("soloCard").innerHTML=`<span class="draw-card-index">CARD / ${String(Math.floor(100+Math.random()*900))}</span><strong>${item[0]}</strong><small>${item[1]}</small>`;$("soloDraw").disabled=true;$("soloDraw").textContent="ИСПЫТАНИЕ ВЫДАНО";$("soloComplete").disabled=false;}
function soloComplete(){if(!soloState.current)return;soloState.current=null;soloState.round++;$("soloRound").textContent="ROUND / "+String(soloState.round).padStart(2,"0");$("soloCard").innerHTML='<span class="draw-card-index">ROUND CLEARED</span><strong>ЕЩЁ ОДИН<br>ЗАХОД?</strong><small>НОВОЕ ИСПЫТАНИЕ УЖЕ ЖДЁТ</small>';$("soloDraw").disabled=false;$("soloDraw").textContent="СЛЕДУЮЩЕЕ ЗАДАНИЕ ↗";$("soloComplete").disabled=true;toast("ЗАДАНИЕ ЗАСЧИТАНО — НОВЫЙ РАУНД");}
$("chooseSolo").addEventListener("click",()=>showMode("solo"));$("chooseDuo").addEventListener("click",()=>showMode("duo"));$("soloBack").addEventListener("click",()=>{$("soloSection").hidden=true;$("modeSelect").scrollIntoView({behavior:"smooth"})});$("duoBack").addEventListener("click",()=>{$("roomSection").hidden=true;$("modeSelect").scrollIntoView({behavior:"smooth"})});
$("soloDraw").addEventListener("click",soloPick);$("soloComplete").addEventListener("click",soloComplete);
document.querySelectorAll(".solo-difficulty").forEach(b=>b.addEventListener("click",()=>{soloState.difficulty=b.dataset.soloDifficulty;document.querySelectorAll(".solo-difficulty").forEach(x=>x.classList.toggle("active",x===b));soloState.used=[];soloState.current=null;$("soloDraw").disabled=false;$("soloDraw").textContent="ВЫТЯНУТЬ КАРТУ ↗";$("soloComplete").disabled=true;$("soloCard").innerHTML='<span class="draw-card-index">DIFFICULTY UPDATED</span><strong>ГОТОВ<br>К НОВОМУ ЧЕЛЛЕНДЖУ?</strong><small>НАЖМИ КНОПКУ НИЖЕ</small>'}));
document.querySelectorAll(".category-btn").forEach(b=>b.addEventListener("click",()=>{soloState.category=b.dataset.category;soloState.used=[];document.querySelectorAll(".category-btn").forEach(x=>x.classList.toggle("active",x===b));soloState.current=null;$("soloDraw").disabled=false;$("soloDraw").textContent="ВЫТЯНУТЬ КАРТУ ↗";$("soloComplete").disabled=true;$("soloCard").innerHTML='<span class="draw-card-index">CATEGORY UPDATED</span><strong>НОВАЯ КАТЕГОРИЯ</strong><small>МОЖНО ТЯНУТЬ КАРТУ</small>'}));

$("createRoom").addEventListener("click",createRoom);$("openRoom").addEventListener("click",()=>$("roomSection").scrollIntoView({behavior:"smooth"}));$("joinRoom").addEventListener("click",joinRoom);$("roomCodeInput").addEventListener("keydown",e=>{if(e.key==="Enter")joinRoom()});$("drawChallenge").addEventListener("click",()=>draw(false));$("rerollChallenge").addEventListener("click",()=>draw(true));$("leaveRoom").addEventListener("click",leaveRoom);if($("duoComplete"))$("duoComplete").addEventListener("click",duoComplete);document.querySelectorAll(".difficulty").forEach(b=>b.addEventListener("click",()=>setDifficulty(b.dataset.difficulty)));$("menuBtn").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
if(!("BroadcastChannel"in window))$("connectionState").innerHTML="<i></i> SINGLE TAB MODE";
