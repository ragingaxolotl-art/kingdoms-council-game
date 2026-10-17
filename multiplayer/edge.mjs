import {handler} from './service.mjs';
import {Store} from './store.mjs';
import initial from './initial.json' with {type:'json'};
const store=new Store(Deno.env.get('SUPABASE_URL'),Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
const settings=await store.rest('classroom_private_config?key=eq.pin_pepper&select=value');
if(!settings[0]?.value)throw Error('Missing private PIN key.');
Deno.serve(handler({store,initial,pepper:settings[0].value}));
