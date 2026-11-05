/* Deadlock Challenge Room — v0.5
   Local rooms work in the same browser profile. Cross-device rooms need Supabase.
*/
const SUPABASE_URL = ""; // https://YOUR-PROJECT.supabase.co
const SUPABASE_ANON_KEY = ""; // public anon key
const $ = (id) => document.getElementById(id);
const challengeDeck = [
  ["СЕНСА НА МАКСИМУМ", "Подними чувствительность мыши до максимума и сыграй весь следующий матч с этой настройкой."],
  ["МИНИМАЛЬНАЯ СЕНСА", "Поставь чувствительность мыши на минимум и попробуй отыграть матч."],
  ["БЕЗ SHIFT", "Убери клавишу Shift из управления на весь матч. Никакого спринта."],
  ["БЕЗ ПРОБЕЛА", "Отключи прыжок на пробел или убери его из биндов до конца матча."],
  ["ОДНА РУКА", "На протяжении первой минуты после возвращения на линию играй только одной рукой. Не рискуй в драках."],
  ["СЛУЧАЙНЫЙ ГЕРОЙ", "Выбери героя случайным образом — без привычных пиков."],
  ["НОВЫЙ ГЕРОЙ", "Сыграй на герое, на котором у тебя меньше всего игрового опыта."],
  ["НЕ ТВОЙ МЕЙН", "Запрещено выбирать своего основного героя."],
  ["СЛУЧАЙНЫЙ БИЛД", "Попроси напарника выбрать твой первый дорогой предмет."],
  ["БЕЗ АКТИВОК", "Не покупай активные предметы до 15-й минуты."],
  ["ТОЛЬКО АКТИВКИ", "Каждый следующий предмет должен иметь активную способность, если такая покупка доступна."],
  ["БЕЗ БОТИНОК", "Не покупай ботинки до 12-й минуты."],
  ["БЕЗ ЗАЩИТЫ", "Не покупай защитные предметы до 15-й минуты."],
  ["НЕСТАНДАРТНЫЙ БИЛД", "Купи минимум три предмета, которые обычно не берёшь на этом герое."],
  ["ОДИН ЦВЕТ", "Покупай предметы только одной выбранной категории до 10-й минуты."],
  ["ЭКОНОМИЯ", "Не покупай предметы дороже 1 250 душ первые 12 минут."],
  ["ДОРОГОЙ СТАРТ", "Первый большой предмет должен стоить максимально дорого для твоего билда."],
  ["СМЕНА ПРИВЫЧЕК", "Купи предмет, который ты почти никогда не собираешь."],
  ["БЕЗ МАГАЗИНА", "Не открывай магазин во время драки и не задерживайся в нём дольше пяти секунд."],
  ["ПЕРВЫЙ ГАНГ", "Совершите успешный ганги до 8-й минуты."],
  ["ОХОТНИК", "Сделай минимум три успешных ганга до 15-й минуты."],
  ["КОМАНДНЫЙ ИГРОК", "Участвуй минимум в пяти командных драках за матч."],
  ["ПЕРВЫЙ ВХОД", "Старайся начинать каждую командную драку первым, если это не самоубийство."],
  ["НЕ ОТСТУПАТЬ", "После начала командной драки не убегай первым."],
  ["ЗАЩИТНИК", "Приоритет — спасать союзников, а не добивать врагов."],
  ["ОХОТА ЗА ОБЪЕКТАМИ", "Сделай контроль объектов главным приоритетом матча."],
  ["MID BOSS", "Будь инициатором хотя бы одной попытки забрать Mid Boss."],
  ["БЕЗ УЛЬТЫ", "Не используй ультимейт первые 10 минут."],
  ["УЛЬТА ПО КД", "Используй ультимейт при каждой разумной возможности, не копи его без причины."],
  ["ТИХИЙ СТАРТ", "Первые восемь минут не используй голосовой чат."],
  ["НЕ СТОЙ", "После каждой волны крипов меняй позицию на карте."],
  ["БЕЗ НЕЙТРАЛОВ", "Первые четыре минуты не бей нейтральных крипов."],
  ["ТОЛЬКО ЛИНИЯ", "До 10-й минуты не покидай свою линию, кроме вынужденных ситуаций."],
  ["СМЕНА МАРШРУТА", "После каждой смерти выбирай другой маршрут возвращения."],
  ["НЕ НА ОДНОМ МЕСТЕ", "Не стой на одной позиции дольше 30 секунд без причины."],
  ["ПОМОЩНИК", "Каждый раз, когда союзнику нужна помощь рядом, постарайся прийти."],
  ["ПЕРВЫЙ КОНТАКТ", "Попробуй организовать первую драку до 6-й минуты."],
  ["БЕЗ СОЛО", "Не начинай драку один, если рядом нет союзника."],
  ["ОХОТА НА КЕРРИ", "Выбери самого опасного врага и мешай ему играть весь матч."],
  ["ЗАБЫТЫЙ ПРЕДМЕТ", "Купи один предмет, который давно не использовал."],
  ["ИНВЕНТАРЬ ХАОСА", "Каждая следующая покупка должна быть из другой категории."],
  ["НЕЗНАКОМЫЙ ПУТЬ", "Попробуй новый маршрут по карте, которым обычно не пользуешься."],
  ["БЕЗ ПОВТОРОВ", "Не покупай один и тот же тип предметов дважды подряд."],
  ["ПЕРЕЗАРЯДКА", "Используй все доступные активные предметы в первой подходящей драке."],
  ["СЛУЧАЙНЫЙ ПИК ОТ ДРУГА", "Пусть напарник выберет тебе героя."],
  ["СЛУЧАЙНЫЙ ПРЕДМЕТ", "Пусть напарник выберет один обязательный предмет для твоего билда."],
  ["ПОЛНЫЙ ХАОС", "Напарник выбирает героя и первый большой предмет."],
  ["НЕ ТВОЙ СТИЛЬ", "Играй максимально нехарактерно для своего обычного стиля, но не мешай команде."],
  ["БЕЗ ПАНИКИ", "После первой смерти не меняй билд из-за эмоций — придерживайся плана."],
  ["ОДИН ШАНС", "После первой смерти следующие пять минут не покупай предметы."],
  ["СЛОЖНЫЙ ГЕРОЙ", "Выбери героя с высоким порогом освоения, которого редко берёшь."],
  ["ПЕРЕЗАПУСК", "После проигранной драки соберись и сыграй следующую максимально аккуратно."],
  ["НЕ ГНАТЬСЯ", "Не преследуй убегающего врага дальше безопасной зоны."],
  ["ЗАБЕРИ РЕСУРСЫ", "Сделай приоритетом сбор доступных душ и ресурсов между драками."],
  ["ПОДДЕРЖКА", "Купи хотя бы один предмет, который помогает всей команде."],
  ["АГРЕССИВНЫЙ РЕЖИМ", "До 10-й минуты попробуй сыграть активнее обычного."],
  ["МИРНЫЙ РЕЖИМ", "Не начинай драку первым до 10-й минуты."],
  ["ПЕРВЫЙ ОБЪЕКТ", "Помоги команде забрать первый доступный объект."],
  ["БЕЗ ПРИВЫЧЕК", "Не используй стандартный стартовый билд."],
  ["СВОЙ ПЛАН", "Перед матчем придумай необычную стратегию и придерживайся её."],
  ["ПОДСТРОЙКА", "Подстрой билд под самого сильного противника."],
  ["ПОСЛЕДНИЙ УДАР", "Постарайся лично добить важный объект или босса, если есть возможность."],
  ["НЕ ЗАБЫВАЙ КОМАНДУ", "Перед каждой большой дракой проверь, где находятся союзники."],
  ["ОДНА ЦЕЛЬ", "Выбери одну игровую цель на матч и играй вокруг неё."],
  ["НЕОЖИДАННЫЙ СТАРТ", "Попроси напарника назвать тебе первую покупку до начала матча."]
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
  $("soloRoundLabel").textContent="ROUND / "+String(soloState.round).padStart(2,"0");
  $("soloCard").innerHTML='<span class="draw-card-index">ROUND CLEARED</span><strong>ЕЩЁ ОДИН<br>ЗАХОД?</strong><small>ЗАДАНИЕ ЗАСЧИТАНО. МОЖНО ТЯНУТЬ СЛЕДУЮЩЕЕ.</small>';
  $("soloDraw").disabled=false;$("soloDraw").textContent="СЛЕДУЮЩЕЕ ЗАДАНИЕ ↗";
  $("soloComplete").disabled=true;toast("ЗАДАНИЕ ЗАСЧИТАНО — НОВЫЙ РАУНД");
}
$("soloDraw").addEventListener("click",soloPick);
$("soloComplete").addEventListener("click",soloComplete);
$("duoShortcut").addEventListener("click",()=>{$("roomSection").hidden=false;$("roomSection").scrollIntoView({behavior:"smooth",block:"start"})});
$("createRoom").addEventListener("click",createRoom);$("openRoom").addEventListener("click",()=>$("roomSection").scrollIntoView({behavior:"smooth"}));$("joinRoom").addEventListener("click",joinRoom);$("roomCodeInput").addEventListener("keydown",e=>{if(e.key==="Enter")joinRoom()});$("drawChallenge").addEventListener("click",()=>draw(false));$("leaveRoom").addEventListener("click",leaveRoom);if($("duoComplete"))$("duoComplete").addEventListener("click",duoComplete);$("menuBtn").addEventListener("click",()=>document.querySelector(".main-nav").classList.toggle("open"));document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".main-nav").classList.remove("open")));
if(!("BroadcastChannel"in window))$("connectionState").innerHTML="<i></i> SINGLE TAB MODE";
