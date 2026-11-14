import { test, expect } from '@playwright/test';
test('present, navigate, demonstrate rules and reveal quiz',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toContainText('HOCKEY');
 await page.getByRole('button',{name:'Let’s drop the puck'}).click();await expect(page).toHaveURL(/#2$/);
 await page.keyboard.press('ArrowLeft');await expect(page).toHaveURL(/#1$/);
 await page.getByRole('button',{name:'All slides'}).click();await expect(page.locator('.overview-grid button')).toHaveCount(19);
 await page.locator('.overview-grid button').nth(7).click();
 await page.getByRole('button',{name:'Move player ahead of puck'}).click();await expect(page.locator('.diagram-callout')).toHaveText('OFFSIDE. PLAYER WENT FIRST');
 await page.keyboard.press('n');await expect(page.locator('.notes')).toContainText('tag up');await page.keyboard.press('Escape');
 await page.goto('/#17');await page.reload();await page.getByRole('button',{name:'Make the call'}).click();await expect(page.locator('.answer h3')).toHaveText('Offside');
 await page.getByRole('button',{name:'Next scenario'}).click();await expect(page.locator('.answer')).toHaveCount(0);
 await page.keyboard.press('End');await expect(page.locator('h1')).toContainText('Sources');expect(errors).toEqual([]);
});
test('all slides fit horizontally and assets load on desktop and mobile',async({page})=>{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  await page.setViewportSize(viewport);
  for(let i=1;i<=19;i++){
   await page.goto('/#'+i);await page.reload();await expect(page.locator('article')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   for(const img of await page.locator('img').all())expect(await img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  }
 }
 await page.setViewportSize({width:1440,height:900});await page.goto('/#1');await page.reload();await page.screenshot({path:'/tmp/hockey-cover.png',animations:'disabled'});
 await page.goto('/#8');await page.reload();await page.screenshot({path:'/tmp/hockey-offside.png',animations:'disabled'});
});
