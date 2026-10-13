import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn(process.execPath,[new URL('./preview.mjs',import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,'')], {env:{...process.env, PORT:'18080'}});
let timer;
try {
 await new Promise((ok,bad)=>{timer=setTimeout(()=>bad(Error('Preview readiness timeout')),10000);child.stdout.once('data',ok);child.once('error',bad);child.once('exit',code=>bad(Error(`Preview exited: ${code}`)));});
 clearTimeout(timer);
 for(const path of ['','privacy-original.html','en/','es/','support/','privacy/','web/site.css','web/site.js','app-ads.txt']){
  const response=await fetch('http://127.0.0.1:18080/tower-of-infinity/'+path);assert.equal(response.status,200,path);assert((await response.text()).length>0);console.log('HTTP 200 /'+path);
 }
 assert.equal((await fetch('http://127.0.0.1:18080/tower-of-infinity/missing-page/')).status,404);
} finally {clearTimeout(timer);child.kill();}
