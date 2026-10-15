// Trust only the Auth server's verified email; user metadata never grants access.
export function teacherVerifier({url,secret,allowedEmail,fetcher=fetch}) {
 const allowed=String(allowedEmail||'').trim().toLowerCase();
 return async authorization=>{
  if(!allowed||!/^Bearer .+/.test(authorization))return null;
  const response=await fetcher(url+'/auth/v1/user',{headers:{apikey:secret,Authorization:authorization}});
  if(!response.ok)return null;
  const user=await response.json();
  return user.id&&user.email_confirmed_at&&typeof user.email==='string'&&user.email.toLowerCase()===allowed?user.id:null;
 };
}
