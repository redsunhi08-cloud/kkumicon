'use strict';
// GitHub Pages용 연결. 실제 권한은 Firebase에 게시한 보안 규칙이 검사합니다.
window.KKPages = (() => {
  const HOST='kkumicon-dc07b-default-rtdb.asia-southeast1.firebasedatabase.app';
  async function database(path,method='GET',body,authenticated=true){
    const c=await KKAuth.settings();
    if(!c.databaseURL)throw Error('Firebase 데이터베이스 연결 설정이 필요합니다.');
    const base=new URL(c.databaseURL);
    if(base.protocol!=='https:'||base.host!==HOST||base.username||base.password||base.search||base.hash||base.pathname!=='/')throw Error('허용되지 않은 데이터베이스 주소입니다.');
    const url=new URL('kkumicon/'+path+'.json',base);
    if(authenticated)url.searchParams.set('auth',await KKAuth.token());
    let response;
    try{response=await fetch(url.href,{method,body:body===undefined?undefined:JSON.stringify(body),headers:{'Content-Type':'application/json'},cache:'no-store',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});}
    catch{throw Error('데이터베이스에 연결하지 못했습니다. 인터넷 연결을 확인해 주세요.');}
    if(!response.ok)throw Error(response.status===401||response.status===403?'Firebase 접근이 거절되었습니다. 관리자 권한과 데이터베이스 보안 규칙 적용 여부를 확인해 주세요.':'데이터 저장 또는 조회에 실패했습니다. 다시 시도해 주세요.');
    return response.json();
  }
  async function overview(){
    const user=await KKAuth.account();
    // 화면 검사용 claims. 실제 접근 제어는 아래 요청의 Firebase 규칙이 수행합니다.
    let claims;try{claims=JSON.parse(atob((await KKAuth.token()).split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{throw Error('로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.');}
    if(claims.admin!==true)throw Error('관리자 권한이 없습니다. 권한 부여 후 다시 로그인해 주세요.');
    await database('adminCheck');
    const [publicWorks,draftWorks,members]=await Promise.all([database('publicWorks'),database('draftWorks'),database('members')]);
    const works=KK.seed.map(seed=>{const published=publicWorks?.[seed.id],draft=draftWorks?.[seed.id];return {...seed,...(draft||published||{}),id:seed.id,visible:!!published,saved:!!(draft||published)};});
    return {environment:'firebase-pages',projectId:(await KKAuth.settings()).projectId,verifiedAt:new Date().toISOString(),user:{uid:user.localId,email:user.email,displayName:user.displayName,admin:true},works,members:Object.entries(members||{}).map(([uid,p])=>({uid,displayName:p.displayName})),counts:{content:works.filter(w=>w.saved).length,members:Object.keys(members||{}).length}};
  }
  async function saveWork(work){
    if(!KK.seed.some(x=>x.id===work.id))throw Error('등록되지 않은 작품입니다.');
    const value={name:String(work.name).trim(),description:String(work.description).trim()};
    if(!value.name||value.name.length>50||!value.description||value.description.length>300)throw Error('작품명은 1~50자, 소개는 1~300자로 입력해 주세요.');
    // 공개/숨김 이동을 한 번에 저장하여 숨긴 작품이 공개 경로에 남지 않게 합니다.
    await database('','PATCH',{['publicWorks/'+work.id]:work.visible?value:null,['draftWorks/'+work.id]:work.visible?null:value});
  }
  async function saveProfile(){const user=await KKAuth.account();return database('members/'+encodeURIComponent(user.localId),'PUT',{displayName:(user.displayName||'꾸미콘 친구').slice(0,50)});}
  async function publicWorks(){const values=await database('publicWorks','GET',undefined,false);return KK.seed.filter(s=>values?.[s.id]).map(s=>({...s,name:String(values[s.id].name),description:String(values[s.id].description),visible:true}));}
  return {overview,saveWork,saveProfile,publicWorks};
})();
