import assert from 'node:assert/strict';import {SupabaseStore} from '../classroom/supabase-store.mjs';
const original=globalThis.fetch,calls=[];let response;
globalThis.fetch=async(url,options)=>{calls.push({url,options});return response;};
try{const store=new SupabaseStore('https://example.supabase.co','server-only-test-key'),row={id:'test-id',owner:'owner-id',version:0,session:{}};
response=new Response(null,{status:201});await store.insert(row);assert.equal(calls.at(-1).options.headers.Prefer,'return=minimal');assert.equal(JSON.parse(calls.at(-1).options.body).owner_id,'owner-id');
response=new Response(null,{status:201});await store.touch('class','member',123);assert(calls.at(-1).url.includes('on_conflict=class_id,member_id'));
response=Response.json([{id:'test-id'}]);assert(await store.cas(0,{...row,version:1}));assert(calls.at(-1).url.includes('version=eq.0'));
response=Response.json([]);assert.equal(await store.cas(0,row),false);
response=Response.json([{body:row}]);assert.deepEqual(await store.load('test-id'),row);
response=Response.json([{id:'class',name:'Room',closed:false,turn:3}]);assert.deepEqual(await store.list('owner-id'),[{id:'class',name:'Room',closed:false,year:3}]);assert(calls.at(-1).url.includes('owner_id=eq.owner-id'));
response=Response.json([{owner_id:'owner-id',revision:4,closed:false,tokens:{},members:[]}]);assert.deepEqual(await store.head('test-id'),{owner:'owner-id',revision:4,closed:false,tokens:{},members:[]});assert(!calls.at(-1).url.includes('select=body'));
response=Response.json(false);assert.equal(await store.rate('test',8),false);
response=new Response('denied',{status:403});await assert.rejects(store.load('test-id'),/Database/);
console.log('PASS Supabase REST empty insert responses, owner filtering, optimistic updates, presence upserts and shared limits');
}finally{globalThis.fetch=original;}
