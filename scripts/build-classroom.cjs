// Deterministic ESM copies of the existing, tested rule engine for Deno and Node.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'classroom/generated');fs.mkdirSync(out,{recursive:true});
for(const [file,name] of [['regiments-development.js','RegimentDevelopment'],['regiments-objectives.js','RegimentObjectives'],['regiments-engine.js','RegimentGame']]){
 const source=path.join(root,'dist',file);if(!fs.existsSync(source))continue;
 let text=fs.readFileSync(source,'utf8');
 text=text.replace(/const D=typeof RegimentDevelopment[^\n]+\n/,"import D from './regiments-development.mjs';\n");
 text=text.replace(/const M=typeof RegimentObjectives[^\n]+\n/,"import M from './regiments-objectives.mjs';\nD.bindObjectives(M);\n");
 // Imports must be outside each legacy IIFE.
 const imports=[...text.matchAll(/^import .+;$/gm)].map(m=>m[0]);text=text.replace(/^import .+;\n/gm,'');
 text=imports.join('\n')+'\n'+text.replace(/if\(typeof module[^\n]+/g,'')+'\nexport default '+name+';\n';
 fs.writeFileSync(path.join(out,file.replace('.js','.mjs')),text);
}
let core=fs.readFileSync(path.join(root,'classroom/core.cjs'),'utf8').replace("const R = require('../dist/regiments-engine.js');","import R from './regiments-engine.mjs';").replace('module.exports =','export default');fs.writeFileSync(path.join(out,'core.mjs'),core);
console.log('Built classroom rules from the current checkout.');

const edge=path.join(root,'supabase/functions/classroom');fs.mkdirSync(edge,{recursive:true});for(const f of ['service.mjs','supabase-store.mjs'])fs.copyFileSync(path.join(root,'classroom',f),path.join(edge,f));fs.cpSync(out,path.join(edge,'generated'),{recursive:true});fs.copyFileSync(path.join(root,'classroom/edge.mjs'),path.join(edge,'index.ts'));
