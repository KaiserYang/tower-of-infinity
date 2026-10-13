import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import vm from 'node:vm';
import {content} from '../content.mjs';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist');
const config=JSON.parse(await readFile(join(root,'site.config.json'),'utf8'));
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){const p=join(dir,entry.name);files.push(...(entry.isDirectory()?await walk(p):[p]));}return files;}
const files=await walk(dist),html=files.filter(f=>f.endsWith('.html'));
assert.equal(html.length,11,'All routes must be generated');
assert.equal(await readFile(join(root,'privacy-original.html'),'utf8'),await readFile(join(dist,'privacy-original.html'),'utf8'),'Original policy must be preserved');
if(config.rootHomepageEnabled){assert((await readFile(join(dist,'index.html'),'utf8')).includes('id="gameplay"'));assert.equal(await readFile(join(root,'index.html'),'utf8'),await readFile(join(dist,'index.html'),'utf8'));}
assert.equal(await readFile(join(root,'app-ads.txt'),'utf8'),await readFile(join(dist,'app-ads.txt'),'utf8'));
assert.deepEqual(Object.keys(content.en).sort(),Object.keys(content.es).sort(),'Translation keys must match');
assert.equal(content.en.faq.length,10);assert.equal(content.es.faq.length,10);
assert.equal(content.en.policy.length,content.es.policy.length);
const markers={};
for(const file of html){const text=await readFile(file,'utf8');const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length);markers[file]=new Set(ids);}
let links=0;
for(const file of html){const text=await readFile(file,'utf8');
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=match[1];if(link.startsWith('https:')||link.startsWith('mailto:'))continue;
  if(link.startsWith('#')){assert(markers[file].has(link.slice(1)),`Missing fragment ${link}`);continue;}
  assert(link.startsWith(config.base),`Incorrect base: ${link}`);
  const [pathname,fragment]=link.split('#');let target=resolve(dist,pathname.slice(config.base.length));if(pathname.endsWith('/'))target=join(target,'index.html');await access(target);if(fragment)assert(markers[target]?.has(fragment),`Missing fragment ${link}`);links++;
 }
 if(file!==join(dist,'privacy-original.html') && (config.rootHomepageEnabled || file!==join(dist,'index.html'))){assert.equal((text.match(/<h1[ >]/g)||[]).length,1);assert(text.includes('hreflang="en"')&&text.includes('hreflang="es"'));assert(text.includes('mailto:ksrorigin@outlook.com'));assert(!/href="(?:#|)"/.test(text));}
}
const js=await readFile(join(dist,'web/site.js'),'utf8');new vm.Script(js);
function runtime({saved,lang='es-ES',page='support',negotiate=true,storageThrows=false}={}){
 let redirect,stored;const anchors=['en','es'].map(language=>({dataset:{language},href:`${config.base}${language}/support/`,addEventListener(event,fn){this.click=fn;}}));const year={};
 const context={document:{body:{dataset:{base:config.base,lang:'en',page,...(negotiate?{negotiate:'true'}:{})}},querySelector:()=>null,querySelectorAll:s=>s==='[data-language]'?anchors:s==='[data-year]'?[year]:[]},localStorage:{getItem(){if(storageThrows)throw Error();return saved;},setItem(k,v){if(storageThrows)throw Error();stored=v;}},navigator:{language:lang},location:{pathname:`${config.base}support/`,search:'?test=1',hash:'#details',replace(v){redirect=v;}},Date,matchMedia:()=>({matches:true})};vm.runInNewContext(js,context);return {redirect,anchors,stored:()=>stored,year};
}
assert.equal(runtime().redirect,`${config.base}es/support/?test=1#details`);
assert.equal(runtime({saved:'en'}).redirect,`${config.base}en/support/?test=1#details`);
assert.equal(runtime({saved:'invalid',lang:'fr'}).redirect,`${config.base}en/support/?test=1#details`);
assert.equal(runtime({storageThrows:true}).redirect,`${config.base}es/support/?test=1#details`);
assert.equal(runtime({negotiate:false}).redirect,undefined);
const state=runtime({negotiate:false});state.anchors[1].click();assert.equal(state.stored(),'es');assert(state.anchors[1].href.endsWith('#details'));
assert(Number(state.year.textContent)>=2026);
assert((await readFile(join(dist,'web/site.css'),'utf8')).includes('prefers-reduced-motion'));
console.log(`PASS: ${html.length} pages, ${links} local references, legal/ad preservation, translation parity and language runtime.`);

// The branch-root deployment must contain the same generated routes as dist.
for(const locale of ['en','es'])for(const route of ['','support/','privacy/']) {
 const relative=locale+'/'+route+'index.html';
 assert.equal(await readFile(join(root,relative),'utf8'),await readFile(join(dist,relative),'utf8'),relative);
}
for(const route of ['home','support','privacy']) {
 assert.equal(await readFile(join(root,route,'index.html'),'utf8'),await readFile(join(dist,route,'index.html'),'utf8'));
}
console.log('PASS: branch-root localized and legal routes match the deployment artifact.');
