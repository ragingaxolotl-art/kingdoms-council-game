import { handler } from './service.mjs';
import { SupabaseStore } from './supabase-store.mjs';
const url=Deno.env.get('SUPABASE_URL'),secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const origin=Deno.env.get('CLASSROOM_ORIGIN');
if(!origin)throw Error('Configure CLASSROOM_ORIGIN before deployment.');
const store=new SupabaseStore(url,secret);
const verifyTeacher=async authorization=>{
 if(!/^Bearer .+/.test(authorization))return null;
 const response=await fetch(url+'/auth/v1/user',{headers:{apikey:secret,Authorization:authorization}});
 if(!response.ok)return null;
 const user=await response.json();return user.id&&user.email_confirmed_at?user.id:null;
};
Deno.serve(handler({store,verifyTeacher,origin,pepper:Deno.env.get('CLASSROOM_PIN_PEPPER')}));
