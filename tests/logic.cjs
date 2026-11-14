'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dir = path.join(__dirname,'..');
const page=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const src=page.match(/<script>([\s\S]*?)<\/script>/)[1];
const glossary=JSON.parse(fs.readFileSync(path.join(dir,'data/glossary.json'),'utf8'));
const saved=new Map(), elements=new Map();
const element=()=>({
  value:'',textContent:'',hidden:true,files:[],children:[],
  add(){},focus(){},addEventListener(){},append(...nodes){this.children.push(...nodes)},
  replaceChildren(...nodes){this.children=nodes},
});
const document={
  getElementById(id){
    if(id==='offline-data')return null;
    if(!elements.has(id))elements.set(id,element());
    return elements.get(id);
  },
  querySelectorAll(){return []},
  createElement:element,
};
const box=vm.createContext({document,window:{location:{search:''},speechSynthesis:{cancel(){}}},SpeechSynthesisUtterance:function(){},
  URLSearchParams,Option:function(label,value){Object.assign(this,{label,value})},fetch:async()=>({ok:true,json:async()=>glossary}),
  localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)}});
(async()=>{
  await vm.runInContext(src,box);
  const run=code=>vm.runInContext(code,box);
  assert.equal(glossary.entries.filter(c=>c.type==='phrase').length,53);
  assert.equal(glossary.entries.filter(c=>c.type==='term'&&c.category==='SPEC').length,113);
  const classroom=glossary.entries.filter(c=>c.type==='term'&&c.category==='CLASS');
  assert.equal(classroom.length,60);
  assert.deepEqual(Object.keys(glossary.vocab_groups.CLASS).map(group=>classroom.filter(c=>c.group===group).length),[12,12,12,12,12]);
  assert.equal(glossary.entries.filter(c=>c.scenario_de).length,10);
  assert.equal(new Set(glossary.entries.map(c=>c.de)).size,glossary.entries.length);
  run("$('category').value='QUANT'; $('mode').value='speak'; $('limit').value='5'; updateStats();");
  assert.match(run("$('stats').textContent"),/12 neu/);
  run("startRound(false); reveal(); rate('again');");
  for(let i=0;i<5;i++){
    if(i===4) assert.match(run("$('position').textContent"),/Wiederholung/);
    run("reveal(); rate('good');");
  }
  assert.match(run("$('summary').textContent"),/5 Karten bearbeitet.*5 gewusst/);
  run("showSetup()");
  assert.match(run("$('stats').textContent"),/7 neu · 0 fällig/);
  assert.equal(saved.size,1);
  run("$('search').value='momentum'; search()");
  assert.equal(run("$('results').children.length"),1);
  run("$('mode').value='scenario'; updateStats(); startRound(false); reveal()");
  assert.match(run("$('position').textContent"),/1 von 3/);
  assert.equal(run("$('answer-text').lang"),'en');
  run("rate('hard'); showSetup(); $('mode').value='recognise'; updateStats(); startRound(false); reveal()");
  assert.equal(run("$('prompt').lang"),'en');
  assert.equal(run("$('answer-text').lang"),'de');
  run("showSetup(); $('mode').value='scenario'; $('category').value='SOLID'; updateStats()");
  assert.equal(run("$('start').disabled"),true);
  const legacyPayload=JSON.stringify({format:'scientific-english-trainer',version:1,records:JSON.parse([...saved.values()][0])});
  assert.equal(run("Object.keys(validateBackup("+legacyPayload+")).length"),6);
  run("$('category').value='SPEC'; $('mode').value='vocab'; $('direction').value='de-en'; changeMode()");
  assert.deepEqual(run("JSON.stringify($('limit').children.map(o=>o.value))"),'["10","20","30","50"]');
  assert.match(run("$('stats').textContent"),/113 neu/);
  run("$('limit').value='50'; startRound(false)");
  assert.equal(run('total'),50);
  assert.equal(run("active.card.type"),'term');
  assert.equal(run("$('prompt').lang"),'de');
  assert.equal(run("$('hear-prompt').hidden"),true);
  run('reveal()');
  assert.equal(run("$('answer-text').lang"),'en');
  assert.equal(run("$('hear-answer').hidden"),true);
  run("rate('hard'); reveal(); rate('again')");
  assert.equal(run("pending.filter(c=>c.retry).length"),2);
  for(let i=0;i<48;i++)run("reveal(); rate('good')");
  assert.match(run("$('position').textContent"),/Wiederholung/);
  run("reveal(); rate('good'); reveal(); rate('again')");
  assert.match(run("$('summary').textContent"),/50 Karten bearbeitet.*49 gewusst.*1 nicht gewusst/);
  assert.equal(run("Object.entries(marks).filter(([k,r])=>k.startsWith('vocab-de-en/')&&r.due-r.updated===day).length"),2);
  run("showSetup(); $('direction').value='en-de'; $('vocab-group').value='SPEC/NMR'; updateStats()");
  assert.match(run("$('stats').textContent"),/28 neu/);
  run("startRound(false); reveal()");
  assert.equal(run('total'),28);
  assert.equal(run("active.card.group"),'NMR');
  assert.equal(run("$('prompt').lang"),'en');
  assert.equal(run("$('answer-text').lang"),'de');
  assert.equal(run("$('hear-prompt').hidden"),true);
  assert.equal(run("$('hear-answer').hidden"),true);
  run("rate('good'); showSetup(); $('mode').value='speak'; changeMode()");
  assert.match(run("$('stats').textContent"),/6 im Filter/);
  assert.deepEqual(run("JSON.stringify($('limit').children.map(o=>o.value))"),'["5","10"]');
  run("$('mode').value='vocab'; $('category').value='QUANT'; changeMode()");
  assert.equal(run("$('start').disabled"),true);
  assert.equal(run("$('group-control').hidden"),true);
  run("window.location.search='?modus=vokabeln&thema=class'; $('direction').value='de-en'");
  await run('init()');
  assert.equal(run("$('category').value"),'CLASS');
  assert.match(run("$('stats').textContent"),/60 neu/);
  assert.equal(run("$('vocab-group').children.length"),6);
  run("$('vocab-group').value='CLASS/TASKS'; $('limit').value='50'; startRound(false); reveal()");
  assert.equal(run('total'),12);
  assert.equal(run('active.card.group'),'TASKS');
  assert.equal(run("$('answer-text').lang"),'en');
  assert.equal(run("$('hear-answer').hidden"),true);
  run("rate('hard')");
  assert.equal(run("pending.filter(c=>c.retry).length"),1);
  run("showSetup(); $('direction').value='en-de'; updateStats(); startRound(false); reveal()");
  assert.equal(run("$('prompt').lang"),'en');
  assert.equal(run("$('answer-text').lang"),'de');
  assert.equal(run("$('hear-prompt').hidden"),true);
  run("rate('good'); showSetup(); window.location.search='?modus=vokabeln'");
  await run('init()');
  assert.equal(run("$('category').value"),'SPEC');
  const payload=JSON.stringify({format:'scientific-english-trainer',version:1,records:JSON.parse([...saved.values()][0])});
  const count=Object.keys(JSON.parse(payload).records).length;
  assert.equal(run("Object.keys(validateBackup("+payload+")).length"),count);
  elements.get('file').files=[{size:payload.length,text:async()=>payload}];
  run('marks={};');
  await run('importMarks()');
  assert.equal(run('Object.keys(marks).length'),count);
  elements.get('file').files=[{size:5,text:async()=>'{oops'}];
  await run('importMarks()');
  assert.match(run("$('backup-message').textContent"),/kein gültiges JSON/);
  assert.equal(run('Object.keys(marks).length'),count);
  console.log('173 vocabulary cards, phrase modes, topic links, both directions, 50-card rounds, subgroups, retries, no audio, and backups verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
