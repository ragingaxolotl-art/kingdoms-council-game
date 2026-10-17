import fs from 'node:fs';
const expected=JSON.parse(fs.readFileSync(new URL('../dist/rules-version.json',import.meta.url))).rulesVersion;
const response=await fetch('https://bnmghtjwolplmdjwgpyl.supabase.co/functions/v1/classroom/rules',{signal:AbortSignal.timeout(20000)});
if(!response.ok||(await response.json()).rulesVersion!==expected)throw Error('Deploy the current classroom Edge Function before publishing: it hosts BOTH student and Battle Lab rules.');
console.log('Both modes use the deployed shared rules.');
