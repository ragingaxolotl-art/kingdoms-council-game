const assert=require('node:assert/strict'),fs=require('node:fs');const M=require('../dist/classroom-map.js');
assert.deepEqual([0,1,9,10,24,25,100].map(M.resourceLevel),[0,1,1,2,2,3,3]);
const demo=JSON.parse(fs.readFileSync(__dirname+'/../dist/classroom-demo.json'));assert(demo.cells.some(c=>c.land&&c.biome?.color));assert(demo.cells.filter(c=>c.land).every(c=>c.biome&&typeof c.biome.name==='string'));console.log('PASS: resource stack thresholds and projected biome colors/names.');
const Nav=require('../dist/map-navigation.js');
for(const width of [320,600,1200]){const cells=[{land:true,polygon:[[0,0],[1200,0],[1200,700],[0,700]]}],f=M.worldFrame(cells,width),scale=width/f.w,height=width*700/1200;
assert((0-f.x)*scale>=29.9);assert((0-f.y)*scale>=79.9);assert((700-f.y)*scale<=height-34.9);assert.deepEqual(Nav.clamp({...f,bounds:f}),{...f,bounds:f});const zoom=Nav.zoom({...f,bounds:f},.5);assert.equal(zoom.bounds,f);const back=Nav.zoom(zoom,2);assert(Math.abs(back.x-f.x)<.001);assert(Math.abs(back.y-f.y)<.001);}
console.log('PASS: responsive world fit reserves city artwork margins and padded zoom bounds.');
