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
const box=vm.createContext({document,window:{},Option:function(){},fetch:async()=>({ok:true,json:async()=>glossary}),
  localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)}});
(async()=>{
  await vm.runInContext(src,box);
  const run=code=>vm.runInContext(code,box);
  assert.equal(glossary.entries.length,53);
  assert.equal(glossary.entries.filter(c=>c.scenario_de).length,10);
  assert.equal(new Set(glossary.entries.map(c=>c.de)).size,53);
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
  console.log('53 cards, 10 scenarios, three modes, retry, storage, search, empty filter and import verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
