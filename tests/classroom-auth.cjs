const assert=require('node:assert/strict'),A=require('../dist/classroom-auth.js');
assert.equal(A.parse('#mapTools'),null);
assert.match(A.parse('#error=access_denied&error_description=untrusted').error,/expired/);
assert.match(A.parse('#access_token=x').error,/incomplete/);
for(const expires of ['0','-1','NaN','Infinity','86401'])assert.ok(A.parse('#access_token=x&refresh_token=y&token_type=bearer&expires_in='+expires).error);
assert.deepEqual(A.parse('#access_token=test-access&refresh_token=test-refresh&token_type=bearer&expires_in=3600',1000),{auth:{kind:'teacher',token:'test-access',refresh:'test-refresh',expires:3601000}});
console.log('Teacher email callback tests passed.');
