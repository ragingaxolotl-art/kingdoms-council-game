// One publication builds both interfaces from the current shared game sources.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),dest=path.join(root,'battle-lab');fs.mkdirSync(dest,{recursive:true});
const crypto=require('node:crypto');const fingerprint=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
const own=['battle-lab.html','battle-online.html','battle-lab-engine.js','battle-lab.js','battle-lab-ui.js','battle-lab-app.js','battle-online.js','battle-online.css'];
for(const f of own){let text=fs.readFileSync(path.join(root,f),'utf8');if(f.endsWith('.html'))text=text.replace(/(src|href)="([^"?#]+)(?:\?[^"#]*)?"/g,(all,attr,url)=>{if(/^(https?:|#|\.\.\/)/.test(url))return all;if(!/\.(js|css|html)$/.test(url))return all;return attr+'="'+(own.includes(url)?'':'../')+url+(/\.(js|css)$/.test(url)?'?rules='+fingerprint(url):'')+'"';});fs.writeFileSync(path.join(dest,f),text);}
// Runtime image URLs are relative to the page; refresh these from shared assets each build.
for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&(d.name==='assets'||/-(icons|images)$/.test(d.name))))fs.cpSync(path.join(root,d.name),path.join(dest,d.name),{recursive:true});
for(const f of ['index.html','classroom.html','student.html','battle-online.html','battle-lab.html']){const p=path.join(root,f);if(!fs.existsSync(p))continue;let text=fs.readFileSync(p,'utf8');text=text.replace(/(src|href)="([^"?#]+\.(?:js|css))(?:\?[^"#]*)?"/g,(all,attr,url)=>fs.existsSync(path.join(root,url))?attr+'="'+url+'?rules='+fingerprint(url)+'"':all);fs.writeFileSync(p,text);}
console.log('Built Battle Lab with shared scripts and current artwork.');
