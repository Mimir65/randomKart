/* Deadlock Challenge Room — v0.5
   Local rooms work in the same browser profile. Cross-device rooms need Supabase.
*/
const SUPABASE_URL = ""; // https://YOUR-PROJECT.supabase.co
const SUPABASE_ANON_KEY = ""; // public anon key
const $ = (id) => document.getElementById(id);
const challengeDeck = [
  ["СЕНСА НА МАКСИМУМ", "Поставь чувствительность мыши на максимум и сыграй весь матч без изменения настройки."],
  ["СЕНСА НА МИНИМУМ", "Поставь чувствительность мыши на минимум и сыграй весь матч."],
  ["БЕЗ SHIFT", "Убери Shift из биндов на весь матч. Спринт запрещён."],
  ["БЕЗ ПРОБЕЛА", "Отключи прыжок на пробел на весь матч. Перебиндить прыжок нельзя."],
  ["НЕ ПОКИДАЙ ЛИНИЮ", "Оставайся на своей линии первые 10 минут. Уходить можно только если линия уже объективно проиграна или команда зовёт на защиту объекта."],
  ["ОДИН НА ОДИН", "До 10-й минуты не принимай помощь союзников на линии. Играй свой матч сам."],
  ["БЕЗ СМЕРТЕЙ", "Твоя цель — закончить матч с нулём смертей. Каждая смерть означает провал испытания."],
  ["ЖЕЛЕЗНАЯ ДИСЦИПЛИНА", "Не умирай до 12-й минуты. Если умер — испытание провалено."],
  ["МИНУС УЛЬТА", "Не используй ультимейт первые 15 минут."],
  ["УЛЬТА ПО КД", "Используй ультимейт при каждой первой разумной возможности после отката."],
  ["БЕЗ АКТИВОК", "Не покупай активные предметы до 20-й минуты."],
  ["ТОЛЬКО АКТИВКИ", "Купи минимум три активных предмета и используй каждый в успешной драке."],
  ["БЕЗ БОТИНОК", "Не покупай ботинки весь матч."],
  ["БЕЗ ЗАЩИТЫ", "До 20-й минуты не покупай защитные предметы."],
  ["СТЕКЛЯННАЯ ПУШКА", "Запрещены защитные предметы весь матч. Собирай только урон и утилити."],
  ["НЕСТАНДАРТНЫЙ БИЛД", "Собери минимум четыре предмета, которые не входят в твой обычный билд."],
  ["СЛУЧАЙНЫЙ БИЛД", "Напарник выбирает тебе первые три предмета. Ты обязан их купить, если они доступны."],
  ["ПЕРВЫЙ ДОРОГОЙ", "Первый большой предмет должен быть самым дорогим из разумных вариантов."],
  ["БЕЗ ПОВТОРОВ", "Ни одной покупки из привычного основного билда."],
  ["ДОЛГИЙ СТАРТ", "Не покупай предметы стоимостью выше 1 250 душ до 15-й минуты."],
  ["НИ ОДНОГО ГАНГА", "До 15-й минуты не уходи с линии ради ганга."],
  ["ГАНГ-МАШИНА", "Совершите минимум пять успешных гангов до 15-й минуты."],
  ["ПЕРВЫЙ ВХОД", "В каждой командной драке ты должен быть одним из первых инициаторов."],
  ["НЕ ОТСТУПАТЬ", "После начала командной драки не выходи из неё, пока не погибнешь или драка не закончится."],
  ["ОХОТА НА КЕРРИ", "В каждой большой драке твоя первая цель — самый опасный вражеский керри."],
  ["MID BOSS ИЛИ НИЧЕГО", "Организуй две попытки забрать Mid Boss за матч."],
  ["ОБЪЕКТЫ ВАЖНЕЕ", "Не начинай драку без цели: каждый файт должен быть ради объекта, босса или защиты."],
  ["БЕЗ НЕЙТРАЛОВ", "Не фарми нейтральных крипов весь матч."],
  ["ТОЛЬКО ЛИНИЯ", "Не покидай свою линию первые 10 минут. Никаких ранних ротаций."],
  ["НИ ОДНОГО СОЛО-ФАЙТА", "Не вступай в драку, если рядом нет хотя бы одного союзника."],
  ["ПЕРВЫЙ КОНТАКТ", "Добейся первого убийства своей команды до 6-й минуты."],
  ["ПЯТЬ АССИСТОВ", "Закончи матч минимум с пятью ассистами."],
  ["МИНИМУМ ТРИ УБИЙСТВА", "Сделай минимум три убийства до 12-й минуты."],
  ["НЕ УМИРАТЬ В ДРАКЕ", "Выживи в трёх командных драках подряд."],
  ["БЕЗ ОТСТУПЛЕНИЯ", "Не используй защитные способности для побега — только для входа или спасения союзника."],
  ["СЛОЖНЫЙ ГЕРОЙ", "Выбери героя, на котором у тебя меньше всего практики."],
  ["НЕ ТВОЙ МЕЙН", "Запрещено выбирать основного героя."],
  ["СЛУЧАЙНЫЙ ПИК", "Напарник выбирает тебе героя. Отказ запрещён."],
  ["ПИК ПО ПРОТИВНИКУ", "Выбери героя, которым неудобно играть против самого сильного врага."],
  ["БЕЗ ПРИВЫЧЕК", "Запрещено использовать стандартные стартовые предметы."],
  ["ОДНА КАТЕГОРИЯ", "Первые три покупки должны быть из одной категории предметов."],
  ["ПОЛНЫЙ ХАОС", "Напарник выбирает героя, первый предмет и направление прокачки."],
  ["БЕЗ МАГАЗИНА", "После 10-й минуты не открывай магазин вне базы."],
  ["ПОКУПКА ПОД ДАВЛЕНИЕМ", "Покупай предметы только после возвращения на базу."],
  ["НИ ОДНОЙ ПОТЕРИ ОБЪЕКТА", "Не допускай потери объекта на своей линии до 10-й минуты."],
  ["ЗАЩИТНИК ЛИНИИ", "Защити свой объект до 10-й минуты, не уходя на другие линии."],
  ["ПЕРЕЗАРЯДКА", "В каждой драке используй все доступные активные предметы."],
  ["НЕ ПРЕСЛЕДУЙ", "Не гонись за врагом дальше ближайшего безопасного участка карты."],
  ["ПОДСТРОЙКА", "После 10-й минуты полностью подстрой билд под самого сильного противника."],
  ["КОНТРОЛЬ КАРТЫ", "Участвуй в захвате минимум трёх нейтральных или командных объектов."],
  ["НЕ ОТДАВАЙ РЕСУРСЫ", "Не пропускай доступные безопасные ресурсы на своей половине карты."],
  ["ОДИН ПЛАН", "Перед матчем выбери одну цель и не отвлекайся от неё до выполнения."],
  ["БЕЗ ПАНИКИ", "После первой смерти следующие пять минут не меняй план билда."],
  ["НЕОЖИДАННЫЙ СТАРТ", "Напарник выбирает тебе первый предмет до начала матча."],
  ["ПЕРЕЗАПУСК НЕЛЬЗЯ", "Если проиграл линию, не меняй линию и не проси свап до 10-й минуты."],
  ["ТРИ ДРАКИ", "Прими участие в трёх командных драках до 15-й минуты."],
  ["ПЕРВЫЙ ОБЪЕКТ", "Твоя команда должна забрать первый объект, и ты обязан участвовать."],
  ["НЕ СТОЙ НА МЕСТЕ", "После каждой волны крипов смени позицию и создай давление на карте."],
  ["ОХОТА БЕЗ ФАРМА", "После 10-й минуты приоритет — ганги и объекты, а не безопасный фарм."],
  ["НИ ОДНОГО ПУСТОГО УЛЬТА", "Каждый ультимейт должен привести к убийству, ассисту, объекту или спасению."],
  ["СЛОЖНЫЙ ФИНИШ", "После 20-й минуты не умирай до конца матча."],
  ["ПОЛНЫЙ КОНТРОЛЬ", "Не допускай, чтобы враг спокойно фармил твою линию после 10-й минуты."],
  ["НЕ СДАВАЙСЯ", "Если отстаёшь по душам, не фарми в одиночку — играй от команды и ищи камбэк."]
];

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
function renderRoom(room){if(!room)return;$("playerOneName").textContent=room.players[0].name||"ОЖИДАНИЕ";$("playerTwoName").textContent=room.players[1].name||"ОЖИДАНИЕ";$("playerOneState").textContent=room.players[0].pick?"ВЫБОР ЗАФИКСИРОВАН":"ВЫБИРАЕТ...";$("playerTwoState").textContent=room.players[1].pick?"ВЫБОР ЗАФИКСИРОВАН":(room.players[1].name?"ВЫБИРАЕТ...":"ОЖИДАЕМ ИГРОКА");$("revealStatus").textContent=room.revealed?"ОБЕ КАРТЫ ОТКРЫТЫ":"ОЖИДАЕМ ОБОИХ ИГРОКОВ";if(room.revealed){[0,1].forEach(i=>{const p=room.players[i].pick;$("reveal"+(i?"Two":"One")+"Title").textContent=p.title;$("reveal"+(i?"Two":"One")+"Text").textContent=p.text;$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.add("revealed")})}else{[0,1].forEach(i=>{$("reveal"+(i?"Two":"One")+"Title").textContent="???";$("reveal"+(i?"Two":"One")+"Text").textContent="Карты пока закрыты.";$("reveal"+(i?"Two":"One")+"Title").parentElement.classList.remove("revealed")})}const mine=room.players[state.player];state.picked=mine.pick;state.rerolls=mine.rerolls;if($("duoComplete")){$("duoComplete").disabled=!(room.revealed&&mine.pick&&!mine.done);$("duoComplete").textContent=mine.done?"✓ ТЫ ПОДТВЕРДИЛ ВЫПОЛНЕНИЕ":"✓ МОЁ ЗАДАНИЕ ВЫПОЛНЕНО"}if(mine.pick){$("drawCard").innerHTML=`<span class="draw-card-index">CARD / ${mine.pick.id}</span><strong>${mine.pick.title}</strong><small>${mine.pick.text}</small>`;$("drawChallenge").textContent="ВЫБОР ЗАФИКСИРОВАН";$("drawChallenge").disabled=true}else{$("drawCard").innerHTML='<span class="draw-card-index">CARD / 000</span><strong>ГОТОВ<br>К ВЫТЯГИВАНИЮ?</strong><small>НАЖМИ КНОПКУ НИЖЕ</small>';$("drawChallenge").textContent="ВЫТЯНУТЬ КАРТУ ↗";$("drawChallenge").disabled=false}document.querySelectorAll(".difficulty").forEach(b=>b.classList.toggle("active",b.dataset.difficulty===mine.difficulty))}
function draw(){const room=getRoom();if(!room)return;const me=room.players[state.player];if(me.pick)return;const item=challengeDeck[Math.floor(Math.random()*challengeDeck.length)];me.pick={id:String(Math.floor(100+Math.random()*900)),title:item[0],text:item[1]};room.revealed=!!(room.players[0].pick&&room.players[1].pick);saveRoom(room);renderRoom(room);toast("КАРТА ВЫТЯНУТА — ЖДИ НАПАРНИКА")}
function setDifficulty(d){if(!state.room)return;updateRoom(r=>{r.players[state.player].difficulty=d});}

function duoComplete(){const room=getRoom();if(!room||!room.revealed)return;room.players[state.player].done=true;if(room.players[0].done&&room.players[1].done){room.players.forEach(p=>{p.pick=null;p.done=false;p.rerolls=1});room.revealed=false;saveRoom(room);renderRoom(room);toast("НОВЫЙ РАУНД — НОВЫЕ ИСПЫТАНИЯ")}else{saveRoom(room);renderRoom(room);toast("ГОТОВО! ЖДЁМ НАПАРНИКА")}}
function leaveRoom(){if(state.channel)state.channel.close();if(state.poll)clearInterval(state.poll);state.room=null;state.player=null;$("gameSection").hidden=true;$("roomSection").hidden=false;$("roomCodeInput").value="";window.scrollTo({top:$("roomSection").offsetTop-30,behavior:"smooth"})}

const soloState={round:1,current:null,used:[]};
function soloPick(){
  let pool=challengeDeck.filter(x=>!soloState.used.includes(x[0]));
  if(!pool.length){soloState.used=[];pool=challengeDeck.slice()}
  const item=pool[Math.floor(Math.random()*pool.length)];
  soloState.current=item;soloState.used.push(item[0]);
  $("soloCard").innerHTML=`<span class="draw-card-index">CARD / ${String(Math.floor(100+Math.random()*900))}</span><strong>${item[0]}</strong><small>${item[1]}</small>`;
  $("soloDraw").disabled=true;$("soloDraw").textContent="ИСПЫТАНИЕ ВЫДАНО";
  $("soloComplete").disabled=false;
}
function soloComplete(){
  if(!soloState.current)return;
  soloState.current=null;soloState.round++;
  $("soloRound").textContent="ROUND / "+String(soloState.round).padStart(2,"0");
  $("soloCard").innerHTML='<span class="draw-card-index">ROUND CLEARED</span><strong>ЕЩЁ ОДИН<br>ЗАХОД?</strong><small>ЗАДАНИЕ ЗАСЧИТАНО. МОЖНО ТЯНУТЬ СЛЕДУЮЩЕЕ.</small>';
  $("soloDraw").disabled=false;$("soloDraw").textContent="СЛЕДУЮЩЕЕ ЗАДАНИЕ ↗";
  $("soloComplete").disabled=true;toast("ЗАДАНИЕ ЗАСЧИТАНО — НОВЫЙ РАУНД");
}
$("soloDraw").addEventListener("click",soloPick);
$("soloComplete").addEventListener("click",soloComplete);
$("duoShortcut").addEventListener("click",()=>{$("roomSection").hidden=false;$("roomSection").scrollIntoView({behavior:"smooth",block:"start"})});
$("createRoom").addEventListener("click",createRoom);$("openRoom").addEventListener("click",()=>$("roomSection").scrollIntoView({behavior:"smooth"}));$("joinRoom").addEventListener("click",joinRoom);$("roomCodeInput").addEventListener("keydown",e=>{if(e.key==="Enter")joinRoom()});$("drawChallenge").addEventListener("click",()=>draw(false));$("leaveRoom").addEventListener("click",leaveRoom);if($("duoComplete"))$("duoComplete").addEventListener("click",duoComplete);$("menuBtn").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
if(!("BroadcastChannel"in window))$("connectionState").innerHTML="<i></i> SINGLE TAB MODE";
