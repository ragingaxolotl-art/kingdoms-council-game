// One publication builds both interfaces from the current shared game sources.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist'),dest=path.join(root,'battle-lab');fs.mkdirSync(dest,{recursive:true});
const version=JSON.parse(fs.readFileSync(path.join(root,'rules-version.json'))).rulesVersion.slice(0,12);
const own=['battle-lab.html','battle-online.html','battle-lab-engine.js','battle-lab.js','battle-lab-ui.js','battle-lab-app.js','battle-online.js','battle-online.css'];
for(const f of own){let text=fs.readFileSync(path.join(root,f),'utf8');if(f.endsWith('.html'))text=text.replace(/(src|href)="([^"?#]+)(?:\?[^"#]*)?"/g,(all,attr,url)=>{if(/^(https?:|#|\.\.\/)/.test(url))return all;if(!/\.(js|css|html)$/.test(url))return all;return attr+'="'+(own.includes(url)?'':'../')+url+(/\.(js|css)$/.test(url)?'?rules='+version:'')+'"';});fs.writeFileSync(path.join(dest,f),text);}
// Runtime image URLs are relative to the page; refresh these from shared assets each build.
for(const d of fs.readdirSync(root,{withFileTypes:true}).filter(d=>d.isDirectory()&&(d.name==='assets'||/-(icons|images)$/.test(d.name))))fs.cpSync(path.join(root,d.name),path.join(dest,d.name),{recursive:true});
for(const f of ['index.html','classroom.html','student.html','battle-online.html','battle-lab.html']){const p=path.join(root,f);if(!fs.existsSync(p))continue;let text=fs.readFileSync(p,'utf8');text=text.replace(/src="((?:regiments-engine|regiments-app|regiments-map-orders|classroom|battle-online|battle-lab(?:-app|-engine|-ui)?)\.js)(?:\?[^"#]*)?"/g,(_,url)=>'src="'+url+'?rules='+version+'"');fs.writeFileSync(p,text);}
console.log('Built Battle Lab with shared scripts and current artwork.');
