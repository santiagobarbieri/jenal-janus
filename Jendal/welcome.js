'use strict';
const welcomeCopy={
 es:{morning:'Buen día.',afternoon:'Buenas tardes.',night:'Buenas noches.',question:'¿En qué te puedo ayudar?',days:['Es domingo. Vamos a tu ritmo.','Arranquemos la semana, una consulta a la vez.','Es martes. ¿Qué resolvemos hoy?','Mitad de semana. Sigamos avanzando.','Es jueves. Vamos con lo que sigue.','Es viernes. ¿Qué te gustaría resolver?','Es sábado. Estoy acá para ayudarte.'],weather:'Usar mi ubicación para el clima',loading:'Consultando el clima…',failed:'No pudimos consultar el clima. Podés volver a intentarlo.',privacy:'Tu ubicación aproximada se envía a Open-Meteo para consultar el clima. No se guarda.',clear:'Cielo despejado',clouds:'Cielo nublado',rain:'Lluvia en tu zona',snow:'Nieve en tu zona',fog:'Niebla en tu zona',storm:'Tormentas en tu zona',weatherLead:'Afuera',retry:'Volver a consultar el clima'},
 en:{morning:'Good morning.',afternoon:'Good afternoon.',night:'Good evening.',question:'How can I help you?',days:['It’s Sunday. Let’s go at your pace.','Let’s start the week, one question at a time.','It’s Tuesday. What shall we solve today?','Midweek. Let’s keep moving forward.','It’s Thursday. Let’s work on what’s next.','It’s Friday. What would you like to solve?','It’s Saturday. I’m here to help.'],weather:'Use my location for weather',loading:'Checking the weather…',failed:'Weather is unavailable. You can try again.',privacy:'Your approximate location is sent to Open-Meteo for weather. It is not saved.',clear:'Clear skies',clouds:'Cloudy skies',rain:'Rain in your area',snow:'Snow in your area',fog:'Fog in your area',storm:'Storms in your area',weatherLead:'Outside',retry:'Check weather again'},
 pt:{morning:'Bom dia.',afternoon:'Boa tarde.',night:'Boa noite.',question:'Como posso ajudar?',days:['É domingo. Vamos no seu ritmo.','Vamos começar a semana, uma consulta por vez.','É terça-feira. O que vamos resolver hoje?','Metade da semana. Vamos em frente.','É quinta-feira. Vamos ao próximo passo.','É sexta-feira. O que você gostaria de resolver?','É sábado. Estou aqui para ajudar.'],weather:'Usar minha localização para o clima',loading:'Consultando o clima…',failed:'Não foi possível consultar o clima. Tente novamente.',privacy:'Sua localização aproximada é enviada ao Open-Meteo para consultar o clima. Ela não é salva.',clear:'Céu limpo',clouds:'Céu nublado',rain:'Chuva na sua região',snow:'Neve na sua região',fog:'Neblina na sua região',storm:'Tempestades na sua região',weatherLead:'Lá fora',retry:'Consultar o clima novamente'}
};
let welcomeWeather=null,weatherLoading=false,weatherFailed=false;
function getWelcomeMarkup(lang,now=new Date()){
 const copy=welcomeCopy[lang];const hour=now.getHours();
 const greeting=hour>=5&&hour<12?copy.morning:hour>=12&&hour<19?copy.afternoon:copy.night;
 const weather=welcomeWeather&&Date.now()-welcomeWeather.fetchedAt<30*60*1000?welcomeWeather:null;
 let context=copy.days[now.getDay()];
 if(weather){const code=weather.code;const condition=code===0?copy.clear:code<=3?copy.clouds:[45,48].includes(code)?copy.fog:[71,73,75,77,85,86].includes(code)?copy.snow:code>=95?copy.storm:code>=51?copy.rain:'';context+=` ${copy.weatherLead}: ${Math.round(weather.temperature)} °C${condition?' · '+condition.toLowerCase():''}.`}
 return `<div class="welcome-state"><span class="welcome-eyebrow">JENDAL · ${new Intl.DateTimeFormat(lang,{weekday:'long',day:'numeric',month:'long'}).format(now)}</span><h2>${greeting}<br><span>${copy.question}</span></h2><p class="welcome-context">${context}</p><div class="welcome-weather">${weather?'<a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo ↗</a>':`<button type="button" data-weather ${weatherLoading?'disabled':''} title="${copy.privacy}">${weatherLoading?copy.loading:weatherFailed?copy.retry:copy.weather}</button>`}</div>${weatherFailed?`<p class="weather-error" role="status">${copy.failed}</p>`:''}</div>`;
}
function refreshWelcome(){
 if(current().messages.length)return;
 const target=document.querySelector('#messages');const focused=target.contains(document.activeElement);
 target.innerHTML=getWelcomeMarkup(state.lang);
 if(focused)target.querySelector('[data-weather],a')?.focus();
}
async function loadWelcomeWeather(){
 if(weatherLoading)return;
 weatherLoading=true;weatherFailed=false;refreshWelcome();
 try{
  if(!navigator.geolocation)throw new Error('Geolocation unavailable');
  const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:10000,maximumAge:300000}));
  const params=new URLSearchParams({latitude:position.coords.latitude.toFixed(2),longitude:position.coords.longitude.toFixed(2),current:'temperature_2m,weather_code',timezone:'auto'});
  const response=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`,{signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('Weather request failed');
  const data=await response.json();
  if(!Number.isFinite(data.current?.temperature_2m)||!Number.isInteger(data.current?.weather_code))throw new Error('Invalid weather');
  welcomeWeather={temperature:data.current.temperature_2m,code:data.current.weather_code,fetchedAt:Date.now()};
 }catch{weatherFailed=true;welcomeWeather=null}
 finally{weatherLoading=false;refreshWelcome()}
}
document.addEventListener('click',event=>{if(event.target.closest('[data-weather]'))loadWelcomeWeather()});
setInterval(()=>{if(!document.hidden)refreshWelcome()},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshWelcome()});
