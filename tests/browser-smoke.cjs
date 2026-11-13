const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM || '/usr/bin/chromium',args:['--no-sandbox']});
  const errors=[];
  try {
    const url=process.env.TRAINER_URL || 'http://127.0.0.1:8765/';
    const desktop=await browser.newPage({viewport:{width:1260,height:850}});
    desktop.on('pageerror',e=>errors.push(e.message));
    const go = async page => {
      await page.goto(url);
      await page.locator('#app').waitFor({state:'visible'});
    };
    await go(desktop);
    await desktop.selectOption('#category','QUANT');
    assert.match(await desktop.locator('#stats').innerText(),/12 neu/);
    await desktop.click('#start');
    assert.equal(await desktop.locator('#prompt').getAttribute('lang'),'de');
    await desktop.click('#reveal');
    assert.equal(await desktop.locator('#answer-text').getAttribute('lang'),'en');
    await desktop.click('[data-rating=again]');
    for(let i=0;i<5;i++){
      if(i===4)assert.match(await desktop.locator('#position').innerText(),/Wiederholung/);
      await desktop.click('#reveal');
      await desktop.click('[data-rating=good]');
    }
    assert.match(await desktop.locator('#summary').innerText(),/5 Karten bearbeitet.*5 gewusst/);
    const records=await desktop.evaluate(()=>JSON.parse(localStorage.getItem('scientific-english-trainer:progress:v1')));
    assert.equal(Object.keys(records).length,5);
    assert.equal(Object.values(records).filter(r=>r.due-r.updated===86400000).length,1);
    await go(desktop);
    await desktop.selectOption('#category','QUANT');
    assert.match(await desktop.locator('#stats').innerText(),/7 neu · 0 fällig/);
    await desktop.locator('#glossary summary').click();
    await desktop.fill('#search','momentum');
    assert.equal(await desktop.locator('#results li').count(),1);
    await desktop.locator('#backup summary').click();
    const downloadPromise=desktop.waitForEvent('download');
    await desktop.click('#export');
    const download=await downloadPromise;
    const exported=await fs.readFile(await download.path());
    assert.deepEqual(JSON.parse(exported).records,records);
    const mobile=await browser.newPage({viewport:{width:360,height:760},isMobile:true,hasTouch:true,deviceScaleFactor:2});
    mobile.on('pageerror',e=>errors.push(e.message));
    await go(mobile);
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),360);
    await mobile.locator('#backup summary').click();
    await mobile.locator('#file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:exported});
    await mobile.waitForFunction(()=>document.querySelector('#backup-message').textContent.includes('5 Kartenstände'));
    await mobile.locator('#file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{garbage')});
    await mobile.waitForFunction(()=>document.querySelector('#backup-message').textContent.includes('kein gültiges JSON'));
    await mobile.selectOption('#category','QUANT');
    assert.match(await mobile.locator('#stats').innerText(),/7 neu/);
    await mobile.selectOption('#mode','recognise');
    assert.match(await mobile.locator('#stats').innerText(),/12 neu/);
    await mobile.click('#start');
    assert.equal(await mobile.locator('#prompt').getAttribute('lang'),'en');
    await mobile.click('#reveal');
    assert.equal(await mobile.locator('#answer-text').getAttribute('lang'),'de');
    await mobile.click('#stop');
    await mobile.selectOption('#mode','scenario');
    assert.match(await mobile.locator('#stats').innerText(),/3 neu/);
    await mobile.click('#start');
    await mobile.click('#reveal');
    assert.equal(await mobile.locator('#answer-text').getAttribute('lang'),'en');
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),360);
    await mobile.screenshot({path:'/tmp/scientific-trainer-mobile.png',fullPage:true});
    await mobile.click('#stop');
    await mobile.selectOption('#category','SOLID');
    assert.equal(await mobile.locator('#start').isDisabled(),true);
    assert.deepEqual(errors,[]);
    console.log('Passed desktop, mobile, three modes, retry, persistence, search, import/export and empty filter.');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
