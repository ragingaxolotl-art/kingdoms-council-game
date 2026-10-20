const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/Users/timetravellog/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),a=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{
const page=await browser.newPage({viewport:{width:1365,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const base=process.argv[2]||'http://127.0.0.1:8060/';await page.goto(base);await page.waitForSelector('[data-good="money"]');
for(const [happiness,bonus,output] of [[60,150,275],[30,75,140],[0,0,50]]){
 const result=await page.evaluate(happiness=>{const t=state.territories[state.countries[active].capital];Object.assign(t,{happiness,settlementLevel:5,baseFoodNeed:3,foodNeed:8,fortification:0,defenseHp:220,production:{money:100,food:100,wood:100,metal:0},researchBonus:{}});selected=t.id;role='economy';popupOpen=true;selectedTroop=null;save();render();return R.output(t).money;},happiness);
 a.equal(result,output);const text=await page.locator('#territoryPopup').innerText();a.match(text,new RegExp('Settlement production \\+'+bonus+'%'));a.match(text,/8\/round \(3 base \+ 5 settlement\)/);a.match(text,/Full settlement bonus at 60 happiness/);
}
await page.reload();await page.waitForSelector('[data-good="money"]');a.equal(await page.evaluate(()=>R.output(state.territories[state.countries[active].capital]).money),50);
await page.evaluate(()=>{selected=state.countries[active].capital;popupOpen=true;render();});await page.setViewportSize({width:390,height:844});await page.locator('#territoryPopup').scrollIntoViewIfNeeded();a(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/private/tmp/settlement-happiness-mobile.png'});
await page.goto(new URL('student.html?preview=1',base).href);await page.locator('#territoryDetail').getByText(/Full bonus at 60 happiness/).waitFor();a.match(await page.locator('#territoryDetail').innerText(),/Full bonus at 60 happiness/);a.deepEqual(errors,[]);
console.log('PASS: displayed 60/30/0 happiness bonuses, additive food breakdown, reload, mobile layout and student explanation.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
