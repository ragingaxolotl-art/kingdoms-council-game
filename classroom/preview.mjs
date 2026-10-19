import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handler } from './service.mjs';
import { LocalStore } from './store.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.CLASSROOM_PORT||8057),origin='http://127.0.0.1:'+port;
const password=process.env.CLASSROOM_PREVIEW_PASSWORD;
if(!password||password.length<12)throw Error('Set CLASSROOM_PREVIEW_PASSWORD (local preview only).');
const store=await new LocalStore(path.join(root,'.classroom-data')).init();
const api=handler({store,origin,pepper:process.env.CLASSROOM_PIN_PEPPER||password.padEnd(40,'-'),verifyTeacher:async auth=>auth==='Bearer '+password?'local-teacher':null});
http.createServer(async(req,res)=>{try{const url=new URL(req.url,origin);if(url.pathname==='/classroom-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.CLASSROOM_CONFIG='+JSON.stringify({api:origin+'/api',preview:true})+';');return;}
 if(url.pathname==='/api'){let bytes=0,chunks=[];for await(const part of req){bytes+=part.length;if(bytes>35e6){res.writeHead(413);res.end();return;}chunks.push(part);}const response=await api(new Request(origin+'/api',{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})}));res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;}
 const pathname=decodeURIComponent(url.pathname==='/'?'/classroom.html':url.pathname),file=path.resolve(root,'dist','.'+pathname);if(!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403);res.end();return;}const data=await fs.readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data);
}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Local classroom preview: '+origin+'/classroom.html'));
