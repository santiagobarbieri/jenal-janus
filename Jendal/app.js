'use strict';
const $ = s => document.querySelector(s);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const translations = {
 es:{newSession:'Nuevo chat',language:'Idioma',pdfs:'Mis PDF',history:'Historial',demo:'Entorno de demostración · Sin conexión al agente Janus',placeholder:'Escribí tu consulta o grabá un audio...',messages:'MENSAJES',empty:'Cada incidente, en contexto.',intro:'Contame qué está pasando. Incluí el sistema, el activo y el código de error para empezar.',context:'Contexto del ticket',noContext:'Esta sesión no tiene un ticket asociado.',sources:'Fuentes',noSources:'No hay fuentes verificadas. Conectá el dominio de conocimiento para consultar procedimientos.',related:'Incidentes relacionados',noRelated:'No hay antecedentes verificados disponibles.',summary:'Generar resumen',copy:'Copiar respuesta',copied:'Respuesta copiada',busy:'Preparando respuesta de demostración…',offline:'Agente no disponible. Tu consulta se conserva para que puedas enviarla cuando vuelva la conexión.',insufficient:'CONTEXTO INSUFICIENTE',response:'Esta es una respuesta de demostración. Todavía no tengo acceso a Janus ni a documentación técnica verificada. Para preparar la consulta, compartí:',steps:['Activo o sistema afectado y línea de producción.','Código de diagnóstico y hora del evento.','Comprobaciones realizadas y resultados observados.'],evidence:'EVIDENCIA · Sin fuentes verificadas',operator:'OPERADOR',newTitle:'Nueva consulta',localFiles:'Los PDF se abren localmente. Están disponibles durante esta visita; todavía no se envían al agente.',choosePDF:'Seleccioná uno o más archivos PDF',noPDF:'Todavía no agregaste documentos.',remove:'Quitar',settings:'Configuración',status:'Estado del agente · simulación',save:'Guardar',ticket:'ID del ticket (opcional)',asset:'Activo / sistema (opcional)',create:'Crear sesión',title:'Título',required:'Escribí un título para la sesión.',saved:'Configuración guardada',voiceUnavailable:'El dictado no está disponible en este navegador. Podés escribir tu consulta.',voiceError:'No se pudo iniciar el dictado. Revisá el permiso del micrófono.',listening:'Escuchando… tocá el micrófono para terminar.',summaryTitle:'RESUMEN DE LA SESIÓN',observed:'Consultas registradas',checks:'Comprobaciones verificadas: ninguna.',next:'Próximo paso: aportar documentación y validar el diagnóstico con el operador.',emptySummary:'Todavía no hay consultas para resumir.',procedure:'Ver fuentes',closed:'Ticket cerrado. Creá una nueva sesión para continuar.'},
 en:{newSession:'New chat',language:'Language',pdfs:'My PDFs',history:'History',demo:'Demo environment · Not connected to the Janus agent',placeholder:'Type your question or record audio...',messages:'MESSAGES',empty:'Every incident, in context.',intro:'Tell me what is happening. Include the system, asset and error code to get started.',context:'Ticket context',noContext:'No ticket is linked to this session.',sources:'Sources',noSources:'No verified sources. Connect the knowledge domain to access procedures.',related:'Related incidents',noRelated:'No verified historical incidents available.',summary:'Generate summary',copy:'Copy response',copied:'Response copied',busy:'Preparing demo response…',offline:'Agent unavailable. Your question is preserved until the connection returns.',insufficient:'INSUFFICIENT CONTEXT',response:'This is a demo response. I do not yet have access to Janus or verified technical documentation. To prepare your query, share:',steps:['Affected asset or system and production line.','Diagnostic code and event timestamp.','Checks performed and observed results.'],evidence:'EVIDENCE · No verified sources',operator:'OPERATOR',newTitle:'New query',localFiles:'PDFs open locally and are available during this visit. They are not sent to the agent yet.',choosePDF:'Select one or more PDF files',noPDF:'No documents added yet.',remove:'Remove',settings:'Settings',status:'Agent status · simulation',save:'Save',ticket:'Ticket ID (optional)',asset:'Asset / system (optional)',create:'Create session',title:'Title',required:'Enter a session title.',saved:'Settings saved',voiceUnavailable:'Dictation is unavailable in this browser. You can type your question.',voiceError:'Could not start dictation. Check microphone permissions.',listening:'Listening… tap the microphone to finish.',summaryTitle:'SESSION SUMMARY',observed:'Recorded queries',checks:'Verified checks: none.',next:'Next step: provide documentation and validate the diagnosis with the operator.',emptySummary:'There are no queries to summarize yet.',procedure:'View sources',closed:'Ticket closed. Create a new session to continue.'},
 pt:{newSession:'Novo chat',language:'Idioma',pdfs:'Meus PDFs',history:'Histórico',demo:'Ambiente de demonstração · Sem conexão com o agente Janus',placeholder:'Escreva sua consulta ou grave um áudio...',messages:'MENSAGENS',empty:'Cada incidente, em contexto.',intro:'Conte o que está acontecendo. Inclua o sistema, o ativo e o código de erro para começar.',context:'Contexto do ticket',noContext:'Esta sessão não tem um ticket associado.',sources:'Fontes',noSources:'Nenhuma fonte verificada. Conecte o domínio de conhecimento para consultar procedimentos.',related:'Incidentes relacionados',noRelated:'Nenhum incidente histórico verificado disponível.',summary:'Gerar resumo',copy:'Copiar resposta',copied:'Resposta copiada',busy:'Preparando resposta de demonstração…',offline:'Agente indisponível. Sua consulta será preservada até a conexão voltar.',insufficient:'CONTEXTO INSUFICIENTE',response:'Esta é uma resposta de demonstração. Ainda não tenho acesso ao Janus ou à documentação técnica verificada. Para preparar a consulta, compartilhe:',steps:['Ativo ou sistema afetado e linha de produção.','Código de diagnóstico e horário do evento.','Verificações realizadas e resultados observados.'],evidence:'EVIDÊNCIA · Sem fontes verificadas',operator:'OPERADOR',newTitle:'Nova consulta',localFiles:'Os PDFs abrem localmente e ficam disponíveis durante esta visita. Ainda não são enviados ao agente.',choosePDF:'Selecione um ou mais arquivos PDF',noPDF:'Nenhum documento adicionado.',remove:'Remover',settings:'Configurações',status:'Estado do agente · simulação',save:'Salvar',ticket:'ID do ticket (opcional)',asset:'Ativo / sistema (opcional)',create:'Criar sessão',title:'Título',required:'Escreva um título para a sessão.',saved:'Configurações salvas',voiceUnavailable:'O ditado não está disponível neste navegador. Você pode digitar sua consulta.',voiceError:'Não foi possível iniciar o ditado. Verifique a permissão do microfone.',listening:'Ouvindo… toque no microfone para terminar.',summaryTitle:'RESUMO DA SESSÃO',observed:'Consultas registradas',checks:'Verificações confirmadas: nenhuma.',next:'Próximo passo: fornecer documentação e validar o diagnóstico com o operador.',emptySummary:'Ainda não há consultas para resumir.',procedure:'Ver fontes',closed:'Ticket fechado. Crie uma nova sessão para continuar.'}
};
const HISTORY_REVISION = 1;
const initialSessions = [{id:'welcome',title:'Nueva consulta',autoTitle:true,messages:[]}];
let state={sessions:initialSessions,active:'welcome',lang:'es',status:'online',historyRevision:HISTORY_REVISION};
try {
 const saved=JSON.parse(localStorage.getItem('jendal-v1'));
 if(saved && translations[saved.lang]) state.lang=saved.lang;
 // Clear existing conversations once; keep conversations created after this reset.
 if(saved?.historyRevision===HISTORY_REVISION && Array.isArray(saved.sessions) && saved.sessions.length && saved.sessions.every(s=>typeof s.id==='string'&&typeof s.title==='string'&&Array.isArray(s.messages)) && saved.sessions.some(s=>s.id===saved.active) && translations[saved.lang]) state={...state,...saved};
 delete state.theme;
 localStorage.setItem('jendal-v1',JSON.stringify(state));
} catch {}
const t = key => translations[state.lang][key];
const current = () => state.sessions.find(s=>s.id===state.active);
let files=[],pending=new Set(),toastTimer,recognition;
function persist(){try{localStorage.setItem('jendal-v1',JSON.stringify(state))}catch{notify('No se pudo guardar el historial en este navegador.')}}
function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4000)}
function setPanel(open){
 $('.app').classList.toggle('panel-open',open);
 $('#sidebar').classList.toggle('open',open);
 $('#sidebar').inert=!open;
 $('#menu').setAttribute('aria-expanded',String(open));
 $('#menu').setAttribute('aria-label',open?'Cerrar panel':'Abrir panel');
 $('#scrim').hidden=!open||innerWidth>650;
}
function closeMenu(){setPanel(false)}
let renderedSession,renderedCount=0;
function showModal(title,html){$('#modal-title').textContent=title;$('#modal-content').innerHTML=html;if(!$('#modal').open)$('#modal').showModal()}
function render(){
 const scrollTop=$('#messages').scrollTop;
 const sessionChanged=renderedSession!==state.active;
 const previousCount=renderedCount;
 const hasNewMessages=previousCount!==current().messages.length;
 const nearBottom=$('#messages').scrollHeight-$('#messages').clientHeight-scrollTop<100;
 const scrollToLatest=sessionChanged||(hasNewMessages&&(nearBottom||current().messages.at(-1)?.role==='user'));
 renderedSession=state.active;renderedCount=current().messages.length;
 document.documentElement.lang=state.lang;
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===state.lang)));
 $('#prompt').placeholder=t('placeholder');$('#prompt').value=current().draft||'';
 $('#session-title').textContent=current().title;
 $('#date').textContent=new Intl.DateTimeFormat(state.lang,{day:'2-digit',month:'short'}).format(new Date());
 $('#message-count').textContent=`${current().messages.length} ${t('messages')}`;
 $('#history').innerHTML=state.sessions.map(s=>`<button class="history-item ${s.id===state.active?'active':''}" data-session="${escapeHTML(s.id)}" title="${escapeHTML(s.title)}" aria-current="${s.id===state.active?'page':'false'}">${escapeHTML(s.title)}${s.id!=='welcome'&&s.messages.length?`<span class="history-ticket">${escapeHTML(s.ticket||'—')} · ${escapeHTML(s.priority||'P3')} · ${s.closed?'CLOSED':'ACTIVE'}</span>`:''}</button>`).join('');
 const ticket=current().ticket;$('#ticket-strip').hidden=!ticket;$('#ticket-strip').textContent=ticket?`${ticket} / ${current().asset||'—'} · ${current().priority||'P3'} · ${current().closed?'CLOSED':'ACTIVE'} · DEMO`:'';
 const isEmpty=current().messages.length===0;
 $('main').classList.toggle('is-empty',isEmpty);
 $('.chat').classList.toggle('is-empty',isEmpty);
 $('#messages').innerHTML=isEmpty?getWelcomeMarkup(state.lang):current().messages.map(renderMessage).join('');
 if(pending.has(state.active)){$('#messages').insertAdjacentHTML('beforeend',`<div class="message assistant technical loading-message" role="status">${t('busy')}</div>`)}
 $('#send').disabled=pending.has(state.active)||!!current().closed;
 $('#prompt').disabled=!!current().closed;
 $('#connection-note').hidden=state.status==='online'&&!current().closed;
 $('#connection-note').textContent=current().closed?t('closed'):t('offline');
 if(sessionChanged){$('#messages').classList.remove('session-enter');void $('#messages').offsetWidth;$('#messages').classList.add('session-enter')}
 else if(hasNewMessages){$('#messages').querySelectorAll('.message:not([role="status"])').forEach((el,i)=>{if(i>=previousCount)el.classList.add('message-enter')})}
 renderContext();requestAnimationFrame(()=>$('#messages').scrollTop=scrollToLatest?$('#messages').scrollHeight:scrollTop);
}
function renderMessage(m,i){
 const meta=m.initial?'':`<span class="message-meta">${m.role==='user'?t('operator'):'JENDAL · DEMO'} · ${m.time?new Date(m.time).toLocaleTimeString(state.lang,{hour:'2-digit',minute:'2-digit'}):'—'}</span>`;
 return `<article class="message ${m.role==='user'?'user':'assistant'} ${m.initial?'initial':'technical'}">${meta}<p>${escapeHTML(m.text)}</p>${m.kind==='insufficient'?`<ol>${t('steps').map(s=>`<li>${s}</li>`).join('')}</ol><div class="source-label">${t('evidence')}</div>`:''}${m.role==='assistant'&&!m.initial?`<div class="message-actions"><button data-copy="${i}">${t('copy')}</button><button data-action="sources">${t('procedure')}</button><button data-action="summary">${t('summary')}</button></div>`:''}</article>`;
}
function renderContext(){const s=current();$('#context-panel').innerHTML=`<h2>${t('context')}</h2><span class="badge">${state.status.toUpperCase()} · DEMO</span>${s.ticket?`<dl><dt>Ticket</dt><dd>${escapeHTML(s.ticket)}</dd><dt>${t('asset').split(' (')[0]}</dt><dd>${escapeHTML(s.asset||'—')}</dd><dt>Prioridad / Priority</dt><dd>${escapeHTML(s.priority||'P3')} · ${s.closed?'CLOSED':'ACTIVE'}</dd><dt>Última actividad / Last update</dt><dd>${s.updated?new Date(s.updated).toLocaleTimeString(state.lang,{hour:'2-digit',minute:'2-digit'}):'—'}</dd></dl>`:`<p>${t('noContext')}</p>`}<h3>${t('sources')} · 0</h3><p>${t('noSources')}</p><h3>${t('related')} · 0</h3><p>${t('noRelated')}</p><button class="context-link" data-action="summary">${t('summary')} ↗<small>${state.lang==='es'?'Preparar el cambio de turno':state.lang==='pt'?'Preparar a troca de turno':'Prepare the shift handover'}</small></button><p>Knowledge domain curated by<br>Hanson Automation</p>`}
function toggleContext(force){
 const panel=$('#context-panel');
 const show=force===undefined?$('#context-toggle').getAttribute('aria-expanded')!=='true':force;
 panel.getAnimations().forEach(animation=>animation.cancel());
 $('#context-toggle').setAttribute('aria-expanded',String(show));
 panel.inert=!show;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){panel.hidden=!show;return}
 if(show){panel.hidden=false;panel.animate([{opacity:0,transform:'translateX(20px)'},{opacity:1,transform:'translateX(0)'}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'})}
 else if(!panel.hidden){panel.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(20px)'}],{duration:180,easing:'ease-in'}).finished.then(()=>panel.hidden=true).catch(()=>{})}
}
function summary(){const s=current(),queries=s.messages.filter(m=>m.role==='user');if(!queries.length){notify(t('emptySummary'));return}const content=`${t('summaryTitle')}\n${s.ticket||'—'} · ${s.asset||'—'}\n\n${t('observed')}\n${queries.map((m,i)=>`${i+1}. ${m.text}`).join('\n')}\n\n${t('checks')}\n${t('evidence')}\n\n${t('next')}`;s.messages.push({role:'assistant',text:content,time:Date.now()});s.updated=Date.now();persist();render()}
$('#history').addEventListener('click',e=>{const b=e.target.closest('[data-session]');if(!b)return;state.active=b.dataset.session;persist();render();closeMenu()});
$('#history-toggle').onclick=()=>{const open=$('#history').hidden;$('#history').hidden=!open;$('#history-toggle').setAttribute('aria-expanded',String(open))};
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{state.lang=b.dataset.lang;persist();render()});
$('#menu').onclick=()=>setPanel($('#menu').getAttribute('aria-expanded')!=='true');
window.addEventListener('resize',()=>setPanel($('#menu').getAttribute('aria-expanded')==='true'));$('#scrim').onclick=closeMenu;
$('#context-toggle').onclick=()=>toggleContext();$('#close-modal').onclick=()=>$('#modal').close();
$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close()}});
$('#new-session').onclick=()=>{
 closeMenu();toggleContext(false);
 const session={id:crypto.randomUUID(),title:t('newTitle'),autoTitle:true,messages:[],updated:Date.now()};
 state.sessions.unshift(session);state.active=session.id;
 persist();render();$('#prompt').style.height='auto';$('#prompt').focus();
};
$('#prompt').oninput=()=>{current().draft=$('#prompt').value;persist();$('#prompt').style.height='auto';$('#prompt').style.height=Math.min($('#prompt').scrollHeight,140)+'px'};
$('#prompt').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#composer').requestSubmit()}};
$('#composer').onsubmit=e=>{e.preventDefault();const s=current(),query=$('#prompt').value.trim();if(!query||pending.has(s.id)||s.closed)return;if(state.status!=='online'){notify(t('offline'));return}if(query==='/summarize'){s.draft='';summary();return}if(['/related','/procedure','/history'].includes(query)){if(query==='/history'){$('#history').hidden=false;$('#history-toggle').setAttribute('aria-expanded','true');setPanel(true)}else toggleContext(true);s.draft='';persist();render();return}if(s.autoTitle&&!s.messages.length){s.title=query.replace(/\s+/g,' ').slice(0,80);s.autoTitle=false}s.messages.push({role:'user',text:query,time:Date.now()});s.draft='';s.updated=Date.now();pending.add(s.id);persist();render();$('#prompt').style.height='auto';const lang=state.lang;setTimeout(()=>{const tr=translations[lang];s.messages.push({role:'assistant',kind:'insufficient',text:`${tr.insufficient}\n\n${tr.response}`,time:Date.now()});pending.delete(s.id);s.updated=Date.now();persist();render()},750)};
document.addEventListener('click',async e=>{const action=e.target.closest('[data-action]');if(action){if(action.dataset.action==='sources')toggleContext(true);if(action.dataset.action==='summary')summary()}const suggestion=e.target.closest('[data-prompt]');if(suggestion){$('#prompt').value=suggestion.dataset.prompt;current().draft=$('#prompt').value;$('#prompt').focus()}const copy=e.target.closest('[data-copy]');if(copy){const m=current().messages[Number(copy.dataset.copy)];const text=m.text+(m.kind==='insufficient'?'\n'+t('steps').join('\n')+'\n'+t('evidence'):'');try{await navigator.clipboard.writeText(text);notify(t('copied'))}catch{showModal(t('copy'),`<textarea style="height:220px" readonly>${escapeHTML(text)}</textarea>`);$('#modal-content textarea').select()}}});
function showDocuments(){showModal(t('pdfs'),`<p>${t('localFiles')}</p><label class="file-upload">${t('choosePDF')}<input type="file" id="pdf-input" accept="application/pdf,.pdf" multiple></label><div id="file-list">${files.length?files.map((f,i)=>`<div class="file-row"><a href="${f.url}" target="_blank" rel="noopener">${escapeHTML(f.name)} ↗</a><button data-remove="${i}">${t('remove')}</button></div>`).join(''):`<p>${t('noPDF')}</p>`}</div>`);$('#pdf-input').onchange=e=>{for(const f of e.target.files){if(!f.name.toLowerCase().endsWith('.pdf')){notify('PDF only');continue}files.push({name:f.name,url:URL.createObjectURL(f)})}$('#pdf-count').textContent=files.length||'';showDocuments()};$('#file-list').onclick=e=>{const b=e.target.closest('[data-remove]');if(b){URL.revokeObjectURL(files[Number(b.dataset.remove)].url);files.splice(Number(b.dataset.remove),1);$('#pdf-count').textContent=files.length||'';showDocuments()}}}
$('#documents').onclick=()=>{closeMenu();showDocuments()};
$('#settings').onclick=()=>{showModal(t('settings'),`<form id="settings-form"><p>${t('demo')}</p><label class="field">${t('status')}<select name="status">${['online','connecting','degraded','offline'].map(s=>`<option value="${s}" ${state.status===s?'selected':''}>${s.toUpperCase()}</option>`).join('')}</select></label><label class="field">Ticket<select name="closed"><option value="false" ${!current().closed?'selected':''}>ACTIVE</option><option value="true" ${current().closed?'selected':''}>CLOSED</option></select></label><button class="primary-button">${t('save')}</button></form>`);$('#settings-form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.target);state.status=data.get('status');current().closed=data.get('closed')==='true';persist();$('#modal').close();render();notify(t('saved'))}};
$('#microphone').onclick=()=>{if(recognition){recognition.stop();return}const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){notify(t('voiceUnavailable'));return}recognition=new SpeechRecognition();recognition.lang={es:'es-AR',en:'en-US',pt:'pt-BR'}[state.lang];recognition.interimResults=false;const session=current();recognition.onresult=e=>{session.draft=(session.draft?session.draft+' ':'')+e.results[0][0].transcript;persist();if(current()===session){$('#prompt').value=session.draft;$('#prompt').focus()}};recognition.onerror=()=>notify(t('voiceError'));recognition.onend=()=>{recognition=null;$('#microphone').style.opacity='';$('#microphone').setAttribute('aria-pressed','false')};try{recognition.start();$('#microphone').style.opacity='1';$('#microphone').setAttribute('aria-pressed','true');notify(t('listening'))}catch{recognition=null;notify(t('voiceError'))}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();toggleContext(false)}});
setPanel(false);
render();
