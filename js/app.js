const BANK = window.QUESTION_BANK;
const DOMAINS=[
'Ethical AI and Responsible Development',
'Generative AI Fundamentals',
'Large Language Models (LLMs) Architecture',
'Model Deployment and Inference',
'NVIDIA AI Enterprise Platform',
'Performance Evaluation and Metrics',
'Prompt Engineering and Optimization',
'RAG (Retrieval-Augmented Generation)',
'Real-world Applications and Use Cases',
'Training and Fine-tuning Techniques'
];
function classifyDomain(q){
 const t=(q.question+' '+q.options.map(o=>o.text).join(' ')+' '+(q.topic||'')).toLowerCase();
 const has=(re)=>re.test(t);
 if(has(/bias|fairness|privacy|responsible ai|trustworthy|explainab|transparen|ethical|security|secure|sensitive user data|content credentials|c2pa|prompt injection|safety controls|guardrails/))return DOMAINS[0];
 if(has(/retrieval.?augmented|\brag\b|vector database|vector store|knowledge base|embedding documents|retriev|ground(ed|ing)? (the )?(response|output|answer)|hallucination/))return DOMAINS[7];
 if(has(/prompt engineer|prompting technique|zero.?shot|few.?shot|one.?shot|in.?context learning|prompt template|prompt optimization|system prompt/))return DOMAINS[6];
 if(has(/bleu|rouge|perplexity|glue benchmark|f1.?score|precision and recall|mean absolute error|evaluation metric|accuracy.*(metric|imbalanc)|metric.*(translation|classification|evaluat)|validity and reliability/))return DOMAINS[5];
 if(has(/fine.?tun|\bpeft\b|\blora\b|back.?propagation|back.?prop|gradient descent|one epoch|dropout|scaling laws|scale.*(parameter|model)|training data|train a neural|during training|distributed data parallel|all.?reduce|gradient/))return DOMAINS[9];
 if(has(/triton inference|tensor.?rt|onnx|inference server|dynamic batching|model repository/))return DOMAINS[3];
 if(has(/nvidia (ngc|base command|rapids|nem[o]?|dgx|ai enterprise|riva|nim)|\bngc\b|\brapids\b|base command platform|nvidia platform|nvidia sdk|nvidia framework|nvidia enterprise|gpu.?accelerated data science|nvidia microservices|nvidia catalog/))return DOMAINS[4];
 if(has(/model deployment|deploy(ing|ment)?|serving|quantization|quantiz|latency|throughput|pinned memory/))return DOMAINS[3];
 if(has(/attention mechanism|autoregressive|auto regressive|transformer architecture|positional encoding|multi.?head attention|self.?attention|tokeniz|language model architecture|decoder|encoder|word2vec|bert|gpt|llm architecture|embedding(s)?/))return DOMAINS[2];
 if(has(/diffusion model|generative ai|generative model|discriminative|generation of|generate (text|image|audio)|what is generative|bigram|corpus|stemming|lemmatization|sentiment analysis|named entity recognition|natural language processing|nlp task/))return DOMAINS[1];
 if(has(/company|business|customer|user clicks|real.?world|application|use case|insurance|bank |fraud|e.?commerce|image recognition|speech.?to.?text|text.?to.?speech|classification task|binary classification|recommendation/))return DOMAINS[8];
 // Consolidated question-bank topic fallbacks keep newly imported questions categorized.
 const topic=(q.topic||'').toLowerCase();
 if(/responsible ai|ethics|alignment/.test(topic))return DOMAINS[0];
 if(/rag|knowledge grounding/.test(topic))return DOMAINS[7];
 if(/evaluation|ml fundamentals/.test(topic))return DOMAINS[5];
 if(/gpu computing|model optimization/.test(topic))return DOMAINS[3];
 if(/nvidia deployment|software development/.test(topic))return DOMAINS[4];
 if(/transformers|language models|attention mechanisms|fine.tuning/.test(topic))return DOMAINS[2];
 if(/nlp|text processing|data preprocessing|python libraries/.test(topic))return DOMAINS[1];
 if(/ai foundations|training techniques/.test(topic))return DOMAINS[1];
 // Use the original topic as a conservative fallback where wording is broad.
 if(/nvidia/i.test(q.topic||''))return DOMAINS[4];
 if(/evaluation|performance|metric/i.test(q.topic||''))return DOMAINS[5];
 if(/rag|knowledge/i.test(q.topic||''))return DOMAINS[7];
 if(/gpu|performance/i.test(q.topic||''))return DOMAINS[3];
 return DOMAINS[1];
}
BANK.forEach(q=>q.domain=classifyDomain(q));
let session=[],index=0,answers={},duration=3600,remaining=3600,ticker=null,startedAt=0,submitted=false,reviewMode=false,elapsed=0,practiceMode=false,paused=false,flagged=new Set();
let attemptSaved=false;
const $=id=>document.getElementById(id);
const shuffle=a=>{let x=a.slice();for(let i=x.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(t){let m=Math.floor(t/60),s=t%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function goTop(){window.scrollTo({top:0,behavior:'smooth'});}
function clearSessionState(){answers={};session=[];flagged=new Set();index=0;submitted=false;reviewMode=false;paused=false;practiceMode=false;elapsed=0;attemptSaved=false;remaining=duration;if(ticker)clearInterval(ticker);ticker=null;}
function reviewCategory(q){return !selected(q).length?'unanswered':correct(q)?'correct':'wrong';}
function applyReviewFilter(filter){document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));document.querySelectorAll('#review .reviewitem').forEach(card=>{card.classList.toggle('hidden',filter!=='all'&&card.dataset.status!==filter);});}
function init(){
 const sel=$('domainFilter');
 DOMAINS.forEach(d=>{let o=document.createElement('option');o.value=d;o.textContent=d;sel.appendChild(o)});
 sel.onchange=()=>updateBankInfo();
 updateBankInfo();
 $('heroQ').textContent=BANK.length;$('heroD').textContent=DOMAINS.length;
}
function availableBank(){const d=$('domainFilter').value;return d==='all'?BANK:BANK.filter(q=>q.domain===d)}
function updateBankInfo(){const pool=availableBank();$('bankInfo').textContent=`${pool.length} questions available · ${$('domainFilter').value==='all'?'all domains':$('domainFilter').value} · ${BANK.length} total in bank`; const topicInfo=$('topicInfo'); if(topicInfo) topicInfo.textContent='Content topics: '+(window.QUESTION_BANK_METADATA?.topics||[]).join(' · ');}

function launchSession(questionList,asPractice=false){
 practiceMode=asPractice;paused=false;flagged=new Set();
 session=questionList.map(q=>({...q,options:q.options.slice()}));
 answers={};index=0;submitted=false;reviewMode=false;attemptSaved=false;
 duration=practiceMode?0:Number($('duration').value)*60;remaining=duration;startedAt=Date.now();elapsed=0;
 $('pauseBtn').classList.toggle('hidden',practiceMode);$('submitMain').textContent=practiceMode?'Finish practice':'Submit exam';
 $('setup').classList.add('hidden');$('hero').classList.add('hidden');$('results').classList.remove('show');$('exam').style.display='grid';
 render();updateClock();goTop();
 if(ticker)clearInterval(ticker);if(duration>0)runTicker();
}
function start(asPractice=false){
 const pool=availableBank();let n=$('count').value==='all'?pool.length:Number($('count').value);n=Math.min(n,pool.length);
 let chosen=shuffle(pool).slice(0,n);if(!$('shuffleQ').checked)chosen=pool.slice(0,n);
 chosen=chosen.map(q=>({...q,options:$('shuffleA').checked?shuffle(q.options):q.options.slice()}));
 launchSession(chosen,asPractice);
}
function retryIncorrect(){
 const missed=session.filter(q=>selected(q).length&&!correct(q));
 if(!missed.length){alert('There are no incorrect answered questions to retry.');return;}
 launchSession(shuffle(missed),true);
}

function runTicker(){if(ticker)clearInterval(ticker);ticker=setInterval(()=>{if(paused||submitted)return;remaining=Math.max(0,remaining-1);updateClock();if(remaining<=0)submit(true)},1000)}
function updateClock(){
 $('clock').textContent=practiceMode?'PRACTICE':duration?fmt(remaining):'∞';
 $('timerBox').className='timer'+(duration&&remaining<=300?' warning':'')+(duration&&remaining<=60?' urgent':'');
}
function selected(q){return answers[q.id]||[]}
function toggle(k){
 if(submitted)return;let q=session[index],a=selected(q).slice();
 if(q.multi)a=a.includes(k)?a.filter(x=>x!==k):[...a,k];else a=[k];
 answers[q.id]=a;render();
}
function answerStatus(q){return selected(q).length?(correct(q)?'Correct':'Not quite'): 'Not answered';}
function feedbackHtml(q){let a=selected(q),ok=correct(q),correctText=q.options.filter(o=>q.answers.includes(o.key)).map(o=>o.text).join(' · ');return `<b class="${ok?'good':'badge'}">${a.length?(ok?'✓ Correct answer':'✕ Incorrect answer'):'No answer selected'}</b><p style="color:var(--text)">${a.length?'Your selection: '+a.map(k=>{let o=q.options.find(x=>x.key===k);return o?esc(o.text):k}).join(' · '):'You did not select an answer.'}</p><p><b>Correct answer:</b> ${esc(correctText)}</p><p>${esc(q.explanation)}</p>${q.tip?`<p><b>Study tip:</b> ${esc(q.tip)}</p>`:''}`;}
function render(){
 let q=session[index];$('qnum').textContent=`QUESTION ${index+1} OF ${session.length} · SOURCE #${q.id}`;
 $('topicChip').textContent=q.domain;$('stem').textContent=q.question;const isFlagged=flagged.has(q.id);$('flagBtn').querySelector('.review-icon').textContent=isFlagged?'★':'☆';$('flagBtn').querySelector('.review-label').textContent=isFlagged?'Marked for review':'Mark for review';$('flagBtn').title=isFlagged?'Remove review mark':'Mark for review';$('flagBtn').setAttribute('aria-label',$('flagBtn').title);$('flagBtn').classList.toggle('flagged',isFlagged);$('flagBtn').disabled=submitted;
 $('multiHint').textContent=practiceMode?(q.multi?'Practice · select every correct option.':'Practice · select one answer.'):q.multi?'Select every correct option.':'Select one answer.';
 let wrap=$('options');wrap.innerHTML='';
 q.options.forEach((o,i)=>{
  let b=document.createElement('button');b.className='option'+(selected(q).includes(o.key)?' sel':'');
  const revealPractice=practiceMode&&selected(q).length>0;
  if((submitted||revealPractice)&&q.answers.includes(o.key))b.classList.add('ok');
  if((submitted||revealPractice)&&selected(q).includes(o.key)&&!q.answers.includes(o.key))b.classList.add('bad');
  b.disabled=submitted&&!reviewMode;b.innerHTML=`<span class="letter">${String.fromCharCode(65+i)}</span><span>${esc(o.text)}</span>`;
  b.onclick=()=>toggle(o.key);wrap.appendChild(b);
 });
 $('prev').disabled=index===0;$('next').textContent=index===session.length-1?(submitted&&reviewMode?'Back to report':practiceMode?'Finish practice':'Last question'):'Next →'; $('submitMain').classList.toggle('hidden',submitted);
 let fb=$('answerFeedback');if(practiceMode&&selected(q).length||submitted){fb.classList.remove('hidden');fb.className='reviewitem '+(correct(q)?'feedback-good':'feedback-bad');fb.innerHTML=feedbackHtml(q)}else{fb.classList.add('hidden');fb.innerHTML=''}
 $('answered').textContent=session.filter(x=>selected(x).length).length;$('remaining').textContent=session.length-Number($('answered').textContent);
 let p=Math.round(Number($('answered').textContent)/session.length*100);$('pct').textContent=p+'%';$('prog').style.width=p+'%';
 let nav=$('navigator');nav.innerHTML='';session.forEach((x,i)=>{let b=document.createElement('button');let hasAnswer=selected(x).length>0;let showResult=practiceMode||submitted;let isCorrect=hasAnswer&&correct(x);b.className='dot'+(i===index?' active':'')+(hasAnswer?' answered':'')+(showResult&&hasAnswer?(isCorrect?' correct-answer':' wrong-answer'):'')+(flagged.has(x.id)?' flagged':'');b.textContent=i+1;b.title=`Question ${i+1}: ${!hasAnswer?'Not answered':showResult?(isCorrect?'Correct':'Incorrect'):'Answered'}${flagged.has(x.id)?' · Marked for review':''}`;b.setAttribute('aria-label',b.title);b.setAttribute('aria-current',i===index?'true':'false');b.onclick=()=>{index=i;render()};nav.appendChild(b)});
}
function submit(auto=false){
 if(submitted)return;
 if(!auto){let unanswered=session.filter(q=>!selected(q).length).length;if(!confirm(`${practiceMode?'Finish practice':'Submit this exam'} now? ${unanswered} question(s) are unanswered.`))return}
 submitted=true;if(ticker)clearInterval(ticker);
 elapsed=duration?duration-remaining:Math.floor((Date.now()-startedAt)/1000);
 showResults(auto);goTop();
}
function correct(q){let a=selected(q),b=q.answers;return a.length===b.length&&a.every(x=>b.includes(x))}
function readHistory(){try{return JSON.parse(localStorage.getItem('ncaGenlAttemptHistory')||'[]')}catch(e){return []}}
function saveAttempt(record){if(attemptSaved)return;attemptSaved=true;try{const h=readHistory();h.unshift(record);localStorage.setItem('ncaGenlAttemptHistory',JSON.stringify(h.slice(0,12)))}catch(e){console.warn('Could not save local attempt history',e)}}
function renderHistory(){const h=readHistory();$('historyList').innerHTML=h.length?h.slice(0,8).map((x,i)=>`<div class="history-row"><div><b>Attempt ${h.length-i} · ${esc(x.mode)}</b><div class="history-meta">${esc(new Date(x.date).toLocaleString())} · ${x.total} questions · ${esc(x.time)}</div></div><strong>${x.score}%</strong></div>`).join(''):'<div class="note">No saved attempts yet. Complete an exam or practice session to build your history.</div>';}
function renderWeakTopics(topics){const weak=Object.entries(topics).map(([name,v])=>({name,...v,pct:Math.round(v.correct/v.total*100)})).filter(x=>x.total>=2).sort((a,b)=>a.pct-b.pct||b.total-a.total).slice(0,3);$('weakTopics').innerHTML=weak.length?weak.map(x=>`<div class="weak-row"><div style="display:flex;justify-content:space-between;gap:12px"><b>${esc(x.name)}</b><strong>${x.pct}%</strong></div><div class="topicbar" style="margin-top:8px"><i class="weak" style="width:${x.pct}%"></i></div><div class="history-meta">${x.correct} correct out of ${x.total} questions · prioritize this topic</div></div>`).join(''):'<div class="note">Not enough questions per topic to identify a reliable weak area.</div>';}
function showResults(auto){
 $('exam').style.display='none';$('results').classList.add('show');goTop();
 let right=session.filter(q=>selected(q).length&&correct(q)).length;
 let wrong=session.filter(q=>selected(q).length&&!correct(q)).length;
 let skip=session.length-right-wrong,p=Math.round(right/session.length*100);
 $('score').textContent=p+'%';$('scoreRing').style.setProperty('--p',p);$('scoreRing').dataset.tone=p>=85?'high':p>=65?'mid':'low';$('scoreRing').setAttribute('aria-label','Overall score '+p+' percent');$('summary').textContent=(practiceMode?'Practice completed. ':auto?'Time expired — your exam was submitted automatically. ':'Exam submitted. ')+(p>=85?'Excellent performance.':p>=65?'Good progress; focus on the topics below.':'Keep studying and use the review section to target weak areas.');
 $('right').textContent=right;$('wrong').textContent=wrong;$('skip').textContent=skip;$('spent').textContent=fmt(elapsed);
 let topics={};session.forEach(q=>{let t=topics[q.domain]||(topics[q.domain]={total:0,correct:0});t.total++;if(selected(q).length&&correct(q))t.correct++});
 $('topicAnalytics').innerHTML=Object.entries(topics).sort((a,b)=>(a[1].correct/a[1].total)-(b[1].correct/b[1].total)).map(([name,v])=>{let pct=Math.round(v.correct/v.total*100);return `<div class="topic-row"><b>${esc(name)}</b><div class="topicbar"><i style="width:${pct}%"></i></div><span>${v.correct}/${v.total} · ${pct}%</span></div>`}).join('');
 renderWeakTopics(topics);saveAttempt({date:new Date().toISOString(),mode:practiceMode?'Practice':'Exam',score:p,total:session.length,right,wrong,skip,time:fmt(elapsed),topics:Object.fromEntries(Object.entries(topics).map(([k,v])=>[k,{correct:v.correct,total:v.total}]))});renderHistory();$('retryWrong').disabled=wrong===0;$('retryWrong').title=wrong?'Start a focused practice session with your incorrect answers':'No incorrect answers to retry';
 const counts={all:session.length,correct:session.filter(q=>reviewCategory(q)==='correct').length,wrong:session.filter(q=>reviewCategory(q)==='wrong').length,unanswered:session.filter(q=>reviewCategory(q)==='unanswered').length};
 $('filterAllCount').textContent=counts.all;$('filterCorrectCount').textContent=counts.correct;$('filterWrongCount').textContent=counts.wrong;$('filterUnansweredCount').textContent=counts.unanswered;
 $('review').innerHTML=session.map((q,i)=>`<div class="reviewitem" data-status="${reviewCategory(q)}"><b>Q${q.id}. ${esc(q.question)}</b><span class="${reviewCategory(q)==='correct'?'good':reviewCategory(q)==='wrong'?'badge':'note'}"> ${answerStatus(q).toUpperCase()} · ${esc(q.domain)}</span><div>${feedbackHtml(q)}</div><button class="btn" onclick="openReviewQuestion(${i})">Review this question</button></div>`).join('');
 applyReviewFilter('all');
}
$('startBtn').onclick=()=>start(false);$('startPractice').onclick=()=>start(true);$('flagBtn').onclick=()=>{let q=session[index];if(flagged.has(q.id))flagged.delete(q.id);else flagged.add(q.id);render()};$('prev').onclick=()=>{if(index>0){index--;render()}};$('next').onclick=()=>{if(index<session.length-1){index++;render()}else if(submitted&&reviewMode){$('exam').style.display='none';$('results').classList.add('show');goTop()}else if(practiceMode)submit(false)};
$('submitMain').onclick=()=>submit(false);
$('retake').onclick=()=>start(practiceMode);$('retryWrong').onclick=retryIncorrect;$('backSetup').onclick=()=>{clearSessionState();$('results').classList.remove('show');$('exam').style.display='none';$('setup').classList.remove('hidden');$('hero').classList.remove('hidden');goTop()};
$('homeBtn').onclick=()=>{if(!$('exam').style.display||$('exam').style.display==='none'){clearSessionState();$('results').classList.remove('show');$('setup').classList.remove('hidden');$('hero').classList.remove('hidden');goTop()}else if(confirm('Leave this exam? Your current attempt will be lost.')){clearSessionState();$('exam').style.display='none';$('results').classList.remove('show');$('setup').classList.remove('hidden');$('hero').classList.remove('hidden');goTop()}};
$('reviewMode').onclick=()=>{reviewMode=true;$('results').classList.remove('show');$('exam').style.display='grid';index=0;render();goTop();};
function openReviewQuestion(i){reviewMode=true;$('results').classList.remove('show');$('exam').style.display='grid';index=i;render();goTop();}
$('pauseBtn').onclick=()=>{if(submitted||practiceMode)return;paused=true;if(ticker)clearInterval(ticker);$('pauseOverlay').classList.add('show')};
$('resumeBtn').onclick=()=>{paused=false;$('pauseOverlay').classList.remove('show');startedAt=Date.now()-(duration-remaining)*1000;runTicker();goTop()};
function cancelSession(){if(!confirm('Cancel this session and return to setup? Your current answers will be discarded.'))return;clearSessionState();$('pauseOverlay').classList.remove('show');$('exam').style.display='none';$('results').classList.remove('show');$('setup').classList.remove('hidden');$('hero').classList.remove('hidden');goTop();}
$('cancelBtn').onclick=cancelSession;$('cancelPaused').onclick=cancelSession;
$('reviewFilters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b)applyReviewFilter(b.dataset.filter)});
$('scrollUp').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});$('scrollDown').onclick=()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});
function updateScrollButtons(){const top=window.scrollY<=12;const bottom=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-12;$('scrollUp').style.display=top?'none':'block';$('scrollDown').style.display=bottom?'none':'block';}
window.addEventListener('scroll',updateScrollButtons,{passive:true});window.addEventListener('resize',updateScrollButtons);
function syncThemeColor(){const m=document.querySelector('meta[name=theme-color]');if(m)m.content=document.body.classList.contains('light')?'#fafafa':'#0a0a0a'}
$('themeBtn').onclick=()=>{document.body.classList.toggle('light');syncThemeColor();const isLight=document.body.classList.contains('light');$('themeBtn').textContent=isLight?'☾ Dark':'☼ Light';try{localStorage.setItem('ncaGenlTheme',isLight?'light':'dark')}catch(e){}};
try{const savedTheme=localStorage.getItem('ncaGenlTheme');if(savedTheme==='dark'){document.body.classList.remove('light');$('themeBtn').textContent='☼ Light'}else{document.body.classList.add('light');$('themeBtn').textContent='☾ Dark'}syncThemeColor()}catch(e){}
document.addEventListener('keydown',e=>{
 if($('pauseOverlay').classList.contains('show'))return;
 const tag=(document.activeElement&&document.activeElement.tagName||'').toLowerCase();if(['input','select','textarea'].includes(tag)||document.activeElement?.isContentEditable)return;
 if($('exam').style.display!=='grid'||!session.length)return;
 if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();if(!submitted)submit(false);return;}
 if(e.key==='ArrowLeft'){e.preventDefault();if(index>0){index--;render()}return;}
 if(e.key==='ArrowRight'||e.key==='Enter'){e.preventDefault();if(index<session.length-1){index++;render()}else if(practiceMode&&!submitted)submit(false);return;}
 if(!submitted&&/^[1-5]$/.test(e.key)){const opt=session[index].options[Number(e.key)-1];if(opt)toggle(opt.key);return;}
 if(!submitted&&e.key.toLowerCase()==='f'){$('flagBtn').click();return;}
});
init();updateScrollButtons();
