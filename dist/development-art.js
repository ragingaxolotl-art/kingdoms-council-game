/* Shared display artwork. Research unlocks never create map buildings. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DevelopmentArt=factory();})(globalThis,()=>{
'use strict';
const sheets={
 bronze:['metallurgy',0,0,724,724],iron:['metallurgy',724,0,746,724],steel:['metallurgy',1470,0,702,724],
 bow:['archery-logistics',50,10,240,700],recurve:['archery-logistics',385,10,250,700],longbow:['archery-logistics',775,10,190,700],
 march:['archery-logistics',980,60,740,630],roads:['archery-logistics',1625,130,547,560],
 agriculture:['production',0,40,541,600],irrigation:['production',541,100,524,550],
 forestry:['production',1065,100,570,550],mining:['production',1635,100,537,550],
 medicine:['facilities-horsemanship',230,20,480,355],education:['facilities-horsemanship',710,0,405,375],
 sanitation:['facilities-horsemanship',1115,0,425,375],manufacturing:['facilities-horsemanship',1540,0,470,410],
 saddles:['facilities-horsemanship',550,380,365,335],stirrups:['facilities-horsemanship',965,380,290,330]
};
const files={commerce:'research-images/storage.svg',copper:'research-images/shield.svg',riding:'troop-icons/cavalry-cutout.png',siege:'troop-icons/artillery.png',granary:'research-images/storage.svg'};
const settlementResearch={construction:{settlementLevel:2,fortification:1},masonry:{settlementLevel:3,fortification:2},planning:{settlementLevel:4,fortification:0},architecture:{settlementLevel:5,fortification:3}};
const facilities={hospital:{name:'Hospital',art:'medicine'},academy:{name:'Academy',art:'education'},civic:{name:'Civic Hall',art:'sanitation'},workshop:{name:'Workshop',art:'manufacturing'},granary:{name:'Granary',art:'granary'}};
// Separate the complete third spear from the neighboring road workers.
const clips={march:'M980 60H1720V300L1660 400L1625 500L1630 580V690H980Z',roads:'M1720 130H2172V690H1630V580L1625 500L1660 400L1720 300Z'};
let serial=0;
function asset(key){const a=sheets[key];return a?{src:`research-icons/${a[0]}.png`,crop:a.slice(1)}:files[key]?{src:files[key]}:null;}
function icon(key,className='research-icon'){
 const a=asset(key);if(!a)return '';
 if(!a.crop)return `<img class="${className}" data-research-art="${key}" src="${a.src}" alt="" draggable="false">`;
 const [x,y,w,h]=a.crop,id='development-art-'+(++serial);
 return `<svg class="${className}" data-research-art="${key}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true" focusable="false"><defs><clipPath id="${id}">${clips[key]?`<path d="${clips[key]}"/>`:`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`}</clipPath></defs><image href="${a.src}" width="2172" height="724" clip-path="url(#${id})"/></svg>`;
}
const built=t=>t.settlementLevel>0?(t.facilities||[]).filter(k=>Object.hasOwn(facilities,k)):[];
const facilityIcon=(kind,className='research-icon')=>facilities[kind]?icon(facilities[kind].art,className):'';
const images=new Map();
function load(key){const a=asset(key);if(!a)return Promise.reject(Error('Missing building artwork.'));if(images.has(a.src))return images.get(a.src).ready;const image=new Image(),record={image};record.ready=new Promise((resolve,reject)=>{image.onload=()=>resolve(image);image.onerror=()=>{images.delete(a.src);reject(Error('Building artwork could not load. Please try the map download again.'));};});images.set(a.src,record);image.src=a.src;return record.ready;}
function paint(ctx,key,x,y,w,h){const a=asset(key),img=a&&images.get(a.src)?.image;if(!img?.complete||!img.naturalWidth)throw Error('Building artwork is still loading.');const crop=a.crop||[0,0,img.naturalWidth,img.naturalHeight],scale=Math.min(w/crop[2],h/crop[3]),dw=crop[2]*scale,dh=crop[3]*scale;const dest=[x+(w-dw)/2,y+(h-dh)/2,dw,dh];if(a.crop)ctx.drawImage(img,...crop,...dest);else ctx.drawImage(img,...dest);}
return {asset,icon,settlementResearch,facilities,built,facilityIcon,load,paint};
});
