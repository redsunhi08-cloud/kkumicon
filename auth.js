'use strict';
window.KKAuth=(()=>{
 const KEY='kk-auth-session';let config=null;
 const errors={EMAIL_EXISTS:'이미 가입된 이메일입니다. 로그인해 주세요.',INVALID_LOGIN_CREDENTIALS:'이메일 또는 비밀번호를 확인해 주세요.',EMAIL_NOT_FOUND:'이메일 또는 비밀번호를 확인해 주세요.',INVALID_PASSWORD:'이메일 또는 비밀번호를 확인해 주세요.',USER_DISABLED:'사용이 중지된 계정입니다. 운영자에게 문의해 주세요.',TOO_MANY_ATTEMPTS_TRY_LATER:'요청이 많습니다. 잠시 뒤 다시 시도해 주세요.',OPERATION_NOT_ALLOWED:'Firebase에서 이메일 로그인을 켜야 합니다.',INVALID_EMAIL:'이메일 형식을 확인해 주세요.',API_KEY_INVALID:'Firebase 연결 설정을 확인해 주세요.',TOKEN_EXPIRED:'로그인 시간이 만료되었습니다. 다시 로그인해 주세요.',INVALID_ID_TOKEN:'다시 로그인해 주세요.',WEAK_PASSWORD:'더 안전한 비밀번호를 입력해 주세요.'};
 async function settings(){if(config)return config;try{const r=await fetch('firebase-config.json',{cache:'no-store'});if(!r.ok)throw Error();config=await r.json();return config;}catch{throw Error('연결 설정 파일을 읽지 못했어요. 로컬 서버로 실행해 주세요.');}}
 function session(){try{return JSON.parse(sessionStorage.getItem(KEY));}catch{return null;}}
 function save(data){try{sessionStorage.setItem(KEY,JSON.stringify(data));}catch{throw Error('로그인 정보를 유지할 수 없어요. 브라우저 저장소를 허용해 주세요.');}}
 async function request(action,body){const c=await settings();if(!c.apiKey||!c.projectId)throw Error('아직 회원 서비스가 연결되지 않았어요. Firebase 설정 후 이용할 수 있습니다.');let r;try{r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${encodeURIComponent(c.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});}catch{throw Error('연결하지 못했어요. 인터넷 상태를 확인하고 다시 시도해 주세요.');}const d=await r.json();if(!r.ok){const code=d.error?.message?.split(' : ')[0];throw Error(errors[code]||'인증 요청을 처리하지 못했어요. 설정 또는 입력값을 확인해 주세요.');}return d;}
 function fromResponse(d){const value={idToken:d.idToken,refreshToken:d.refreshToken,expiresAt:Date.now()+Number(d.expiresIn||3600)*1000,email:d.email,displayName:d.displayName||'',uid:d.localId};save(value);return value;}
 async function login(email,password){return fromResponse(await request('signInWithPassword',{email,password,returnSecureToken:true}));}
 async function signup(email,password,displayName){const d=await request('signUp',{email,password,returnSecureToken:true});const s=fromResponse(d);try{await request('update',{idToken:s.idToken,displayName,returnSecureToken:false});s.displayName=displayName;save(s);}catch{s.profilePending=true;}try{await request('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:s.idToken});s.verificationSent=true;}catch{s.verificationSent=false;}return s;}
 async function token(){let s=session();if(!s)throw Error('로그인이 필요합니다.');if(Date.now()<s.expiresAt-60000)return s.idToken;const c=await settings();let r;try{r=await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(c.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',refresh_token:s.refreshToken}),signal:AbortSignal.timeout(15000)});}catch{throw Error('로그인 갱신에 실패했어요. 인터넷 연결을 확인해 주세요.');}if(!r.ok){logout();throw Error('로그인이 만료되었어요. 다시 로그인해 주세요.');}const d=await r.json();s={...s,idToken:d.id_token,refreshToken:d.refresh_token,expiresAt:Date.now()+Number(d.expires_in)*1000};save(s);return s.idToken;}
 async function account(){const d=await request('lookup',{idToken:await token()});return d.users[0];}
 function logout(){try{sessionStorage.removeItem(KEY);}catch{}}
 async function reset(email){await request('sendOobCode',{requestType:'PASSWORD_RESET',email});}
 async function verify(){await request('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:await token()});}
 // 실제 관리자 데이터는 역할 검증을 수행하는 서버에서만 제공합니다.
 async function adminOverview(){
   const c=await settings();
   if(c.databaseURL && window.KKPages)return window.KKPages.overview();
   if(!c.adminApiBase)throw Error('관리자 서버로 접속해 주세요. 관리자서버실행.cmd를 실행한 뒤 http://127.0.0.1:8001 에서 다시 로그인하세요.');
   const base=new URL(c.adminApiBase,location.href);
   if(base.origin!==location.origin)throw Error('관리자 API는 같은 사이트의 보안 서버 경로로 설정해 주세요.');
   let r;
   try { r=await fetch(base.href.replace(/\/$/,'')+'/overview',{headers:{Authorization:`Bearer ${await token()}`},cache:'no-store',signal:AbortSignal.timeout(25000)}); }
   catch(error){if(error.name==='TypeError'||error.name==='TimeoutError')throw Error('관리자 서버에 연결하지 못했어요. 서버 실행 창과 인터넷 연결을 확인해 주세요.');throw error;}
   if(!r.headers.get('content-type')?.includes('application/json'))throw Error('관리자 API가 응답하지 않습니다. Python 서버 대신 관리자서버실행.cmd를 실행해 주세요.');
   const result=await r.json();
   if(!r.ok)throw Error(result.error||(r.status===401||r.status===403?'관리자 권한이 없습니다. 운영자에게 문의해 주세요.':'관리자 서버 응답을 확인해 주세요.'));
   if(result.user?.admin!==true||!result.verifiedAt)throw Error('서버의 관리자 확인 결과가 올바르지 않습니다.');
   return result;
 }

 return {settings,session,login,signup,logout,reset,verify,account,adminOverview,token};
})();
