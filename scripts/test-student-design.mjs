import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000}});
  const page = await context.newPage(); const errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('header .ueh-logo').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  assert.equal(await page.getByText('Bản mô phỏng dành cho học tập',{exact:true}).count(),0);
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
  await page.getByRole('button',{name:'Cơ sở Nguyễn Văn Linh',exact:false}).click();
  await page.getByRole('heading',{name:'Kết quả tìm kiếm'}).waitFor();
  await page.locator('.room-card').first().waitFor();
  assert.equal(await page.getByLabel('Cơ sở học',{exact:false}).inputValue(),'N');
  assert.match(await page.locator('.card-district').first().textContent(),/Bình Chánh/);
  await page.setViewportSize({width:375,height:812});
  await page.goto(base+'/search',{waitUntil:'networkidle'});
  const toggle=page.getByRole('button',{name:/Bộ lọc tìm phòng/});
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await toggle.click();
  await page.getByLabel('Giá thuê tối đa').fill('2900000');
  await page.getByRole('button',{name:'Áp dụng bộ lọc'}).click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.locator('.room-card').first().waitFor();
  await page.getByRole('button',{name:'Xem phòng',exact:false}).first().click();
  await page.getByRole('heading',{name:'Checklist nhỏ, an tâm hơn'}).waitFor();
  await page.getByLabel('Kiểm tra khóa cửa và lối thoát hiểm').check();
  assert.match(await page.locator('.checklist-progress').textContent(),/1\/4/);
  await page.getByRole('button',{name:'Tùy chỉnh chi phí'}).click();
  await page.getByLabel(/Điện \(kWh/).fill('50');
  const routes=['/','/search','/rooms/room-1','/rooms/room-1/reviews','/rooms/room-3/verification','/rooms/room-1/contact','/account','/favorites','/notifications'];
  const checked=[];
  for(const width of [375,768,1024,1440]){
    await page.setViewportSize({width,height:width<600?812:1000});
    for(const route of routes){
      await page.goto(base+route,{waitUntil:'networkidle'});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      if(overflow) {
        const culprits=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1;}).slice(0,12).map(e=>e.className));
        throw new Error(`Overflow ${width} ${route}: ${JSON.stringify(culprits)}`);
      }
      assert.equal(await page.locator('h1').count(),1,`${width} ${route} needs one h1`);
      if([375,1440].includes(width)&&['/','/search','/rooms/room-1','/account'].includes(route))await page.screenshot({path:`outputs/redesign-${width}-${route.replaceAll('/','-')||'home'}.png`,fullPage:true});
      checked.push({width,route});
    }
    console.log('Responsive routes passed:',width);
  }
  await page.setViewportSize({width:844,height:390});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.setViewportSize({width:375,height:812});await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.screenshot({path:'outputs/redesign-mobile-viewport.png'});
  assert.equal(await page.locator('.bottom-nav').isVisible(),true);
  assert.deepEqual(errors,[]);
  writeFileSync('outputs/student-design-report.json',JSON.stringify({passed:true,checked,errors},null,2));
  console.log('PASS: logo, campus shortcuts, mobile filters, checklist, cost controls, 36 responsive routes, landscape and reduced motion.');
} finally { await browser.close(); }
