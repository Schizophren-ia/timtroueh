import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
const testTitle='Phòng kiểm tra UI '+Date.now();const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/signin-with-chatgpt?return_to=/manage',{waitUntil:'networkidle'});
await page.getByRole('button',{name:'Thêm phòng',exact:true}).click();
await page.getByLabel('Mã phòng',{exact:true}).fill('TEST-UI-'+Date.now());
await page.getByLabel('Tên phòng',{exact:true}).fill(testTitle);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4xQAAAAASUVORK5CYII=','base64');
await page.locator('input[type=file]').first().setInputFiles({name:'test.png',mimeType:'image/png',buffer:png});
await page.getByRole('status').filter({hasText:'Đã tải tệp'}).waitFor();
await page.getByRole('button',{name:'Lưu phòng',exact:true}).click();
await page.getByRole('status').filter({hasText:'Đã tạo phòng'}).waitFor();
const row=page.locator('tr').filter({hasText:testTitle});await row.getByRole('button',{name:'Sửa',exact:true}).click();
await page.getByLabel(/^Trạng thái/).selectOption('available');
await page.getByRole('button',{name:'Lưu phòng',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã cập nhật phòng'}).waitFor();
const result=await context.request.get('http://127.0.0.1:5173/api/rooms?manage=1');const data=await result.json();const room=data.rooms.find(r=>r.title===testTitle);
if(!room||room.status!=='available')throw new Error('UI save failed');
const image=await context.request.get('http://127.0.0.1:5173'+room.images[1]);if(image.status()!==200)throw new Error('Uploaded image unavailable');
await context.request.delete('http://127.0.0.1:5173/api/rooms/'+room.id);
const resultReview=await context.request.post('http://127.0.0.1:5173/api/rooms/room-3/reviews',{data:{category:'room',rating:5,landlordScore:5,roomScore:5,infoScore:5,body:'Đánh giá kiểm tra UI.',checklist:['Sạch sẽ']}});
if(resultReview.status()!==201)throw new Error('Cannot submit review');const createdReview=await resultReview.json();
await page.goto('http://127.0.0.1:5173/manage',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Duyệt đánh giá',exact:true}).click();
await page.locator('.moderation-card').filter({hasText:'Đánh giá kiểm tra UI.'}).getByRole('button',{name:'Duyệt đăng'}).click();await page.getByRole('status').filter({hasText:'Đã đăng đánh giá'}).waitFor();
await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.screenshot({path:'outputs/home-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
for(const route of ['/','/search','/rooms/room-1','/rooms/room-3/verification','/rooms/room-1/reviews','/rooms/room-1/contact','/account','/notifications','/manage']){
await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle'});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Horizontal overflow '+route);
if(route==='/')await page.screenshot({path:'outputs/home-mobile.png',fullPage:true});}
if(errors.length)throw new Error(errors.join(';'));writeFileSync('outputs/browser-extra-report.json',JSON.stringify({passed:true,uploads:true,roomCRUD:true,moderation:true,mobileRoutes:9,errors},null,2));console.log('PASS: room create/edit, R2 upload/serve, review moderation, nine mobile routes.');
} finally {await browser.close();}

