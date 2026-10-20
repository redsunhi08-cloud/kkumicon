'use strict';
const $=s=>document.querySelector(s), {escape:esc,character}=KK;
let selected='전체', query='', limit=8, wishOnly=false;
let wishes=KK.read('kk-wishes',[]);if(!Array.isArray(wishes))wishes=[];
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,3200);}
function openDialog(html){$('#dialog-content').innerHTML=html;$('#detail-dialog').showModal();}
$('.dialog-close').onclick=()=>$('#detail-dialog').close();
$('#detail-dialog').addEventListener('click',e=>{if(e.target===$('#detail-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
const emotions=['전체','인사','감사','응원','사랑','일상','직장'];
$('#emotion-filters').innerHTML=emotions.map((e,i)=>`<button class="chip ${i?'':'active'}" aria-pressed="${!i}" data-emotion="${e}">${['✦','☀','♡','✧','♥','☕','▣'][i]} ${e}</button>`).join('');
function render(){
 const works=KK.works().map(x=>window.KKContentLookup?window.KKContentLookup(x):x).filter(x=>x.visible&&(selected==='전체'||x.emotion===selected)&&(!wishOnly||wishes.includes(x.id))&&`${x.name} ${x.description} ${x.emotion} ${(x.tags||[]).join(' ')} 손꿈이`.includes(query));
 $('#result-count').textContent=`${wishOnly?'찜한 친구':'만나볼 친구'} ${works.length}명`;$('#wish-count').textContent=wishes.length;
 $('#wishlist').classList.toggle('selected',wishOnly);
 $('#art-grid').innerHTML=works.length?works.slice(0,limit).map(x=>`<article class="art-card"><div class="art-image" style="background:${x.bg}"><span class="sample-label">CONCEPT</span><button class="wish-button ${wishes.includes(x.id)?'saved':''}" data-wish="${x.id}" aria-label="${esc(x.name)} 찜" aria-pressed="${wishes.includes(x.id)}">${wishes.includes(x.id)?'♥':'♡'}</button><button class="art-open" data-work="${x.id}" aria-label="${esc(x.name)} 작품 상세 보기">${character(x.kind,x.name)}</button><span class="art-caption">${esc(x.description.split('.')[0])}</span></div><button class="art-title" data-work="${x.id}"><h3>${esc(x.name)}</h3><span>↗</span></button><p class="creator-name">손꿈이 <span>·</span> 캐릭터 기획</p><div class="tags">${(x.tags??[x.emotion,'마음한스푼']).map(t=>`<span>#${esc(t)}</span>`).join('')}</div></article>`).join(''):'<div class="empty-state"><span>♡</span><h3>아직 일치하는 친구가 없어요</h3><p>다른 이름이나 감정으로 찾아보세요.</p><button class="button white" id="reset-filters">전체 친구 보기</button></div>';
 $('#more-art').hidden=works.length<=limit;window.dispatchEvent(new Event('kk-render'));
}
function reset(){selected='전체';query='';wishOnly=false;limit=8;$('#search').value='';document.querySelectorAll('[data-emotion]').forEach(b=>{b.classList.toggle('active',b.dataset.emotion==='전체');b.setAttribute('aria-pressed',b.dataset.emotion==='전체');});render();}
$('#emotion-filters').onclick=e=>{const b=e.target.closest('[data-emotion]');if(!b)return;selected=b.dataset.emotion;limit=8;document.querySelectorAll('[data-emotion]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});render();};
$('#search-form').onsubmit=e=>{e.preventDefault();query=$('#search').value.trim();limit=10;render();};
$('#search').addEventListener('input',()=>{query=$('#search').value.trim();render();});
$('#more-art').onclick=()=>{limit=10;render();};$('#show-all').onclick=reset;
$('#wishlist').onclick=()=>{wishOnly=!wishOnly;render();$('#collection').scrollIntoView({behavior:'smooth'});};
document.addEventListener('click',e=>{
 const w=e.target.closest('[data-wish]');if(w){const id=w.dataset.wish;const next=wishes.includes(id)?wishes.filter(x=>x!==id):[...wishes,id];if(!KK.write('kk-wishes',next))return toast('저장 공간을 사용할 수 없어요. 브라우저 설정을 확인해 주세요.');wishes=next;render();toast(wishes.includes(id)?'찜했어요! 이 브라우저에 저장됩니다.':'찜 목록에서 뺐어요.');}
 const a=e.target.closest('[data-work]');if(a){const x=KK.works().find(x=>x.id===a.dataset.work);openDialog(`<div class="detail-art" style="background:${x.bg}">${character(x.kind,x.name)}</div><span class="eyebrow">CHARACTER CONCEPT · 기획 예시</span><h2>${esc(x.name)}</h2><p>${esc(x.description)}</p><p class="muted">손꿈이 · #${x.emotion}</p><div class="notice">이 캐릭터는 홈페이지 구성을 위한 기획 일러스트입니다. 실제 승인 작품과 판매 링크는 준비 후 안내할게요.</div><button class="button yellow" data-wish="${x.id}">찜 ${wishes.includes(x.id)?'해제':'하기'} ♡</button>`);}
 if(e.target.closest('#reset-filters'))reset();
 const info=e.target.closest('[data-info]');if(info)showInfo(info.dataset.info);
});
const info={world:['꾸미콘의 작은 세계','낙천적인 꾸미, 다정한 몽실, 느긋한 포근. 저마다의 속도로 살아가는 작은 친구들이 모였어요. 캐릭터 컬렉션에서 열 가지 기획 캐릭터의 성격과 이야기를 만나보세요.'],goods:['귀여운 일상을 준비하고 있어요','아크릴 키링, 스티커, 엽서 등 캐릭터 굿즈를 기획하고 있습니다. 현재 표시된 이미지는 콘셉트 시안이며, 판매 중인 상품이 아닙니다. 출시 일정과 가격은 확정 후 안내할게요.'],lounge:['우리의 작은 팬 라운지','좋아하는 캐릭터와 팬아트를 나누는 공간을 준비 중이에요. 지금은 작품을 둘러보고 마음에 드는 친구를 찜할 수 있어요. 문의는 아래 작가 이메일로 보내주세요.'],artist:['마음을 그리는 손꿈이','이모티콘 작가이자 캐릭터·굿즈 크리에이터 손꿈이의 공간입니다. 작은 표정 하나로 마음이 전해지는 순간을 꾸미콘에 담고 있어요. 정식 작가 인터뷰는 준비 중입니다. 협업 문의: sp0823@naver.com'],welcome:['꾸미콘에 오신 걸 환영해요','이곳은 작가 손꿈이의 캐릭터 작업실입니다. 현재는 홈페이지 미리보기 단계로, 컬렉션에 보이는 작품은 창작 기획 예시입니다.'],preview:['새로운 친구들을 만나보세요','열 가지 캐릭터 기획을 컬렉션에 모았어요. 작품을 누르면 소개를 볼 수 있고, 하트 버튼으로 좋아하는 친구를 이 브라우저에 저장할 수 있어요.'],terms:['이용 안내 · 운영 전 검토용','작품과 굿즈는 현재 기획 예시입니다. 자체 결제나 구매는 지원하지 않습니다. 캐릭터 소개와 화면을 자유롭게 둘러보세요. 정식 이용약관은 운영 시작 전 확정이 필요합니다.'],privacy:['개인정보 안내 · 운영 전 검토용','찜 목록과 관리자 미리보기에서 수정한 작품 정보는 이 브라우저에 저장됩니다. 로그인 연결 전에는 회원가입 정보가 전송되지 않습니다. Firebase 연결 후 회원가입 시 이메일과 비밀번호가 Firebase 인증 서비스로 전송되며 비밀번호는 이 사이트에 저장하지 않습니다. 정식 개인정보처리방침과 보관·삭제 절차는 운영 전 확정이 필요합니다.']};
function showInfo(key){const [title,body]=info[key]||info.welcome;openDialog(`<span class="eyebrow">FROM KKUMICON</span><h2>${title}</h2><p>${body}</p><a class="text-link" href="mailto:sp0823@naver.com">작가에게 문의하기 ↗</a>`);}
$('#side-character').innerHTML=character('rabbit');$('#keyring-character').innerHTML=character('yellow');$('#sticker-art').innerHTML=['yellow','rabbit','bean','bear'].map(x=>character(x)).join('');$('#postcard-art').innerHTML=character('bean');$('#artist-character').innerHTML=character('rabbit');
let slide=0;const slides=[['작은 표정 하나가,<br>오늘의 <em>마음</em>을 대신해요.','말로 다 전하지 못한 마음도 괜찮아요.<br>나를 닮은 귀여운 친구가 대신 전해줄 거예요.','이모티콘 만나보기','#collection'],['소소한 일상에도,<br><em>귀여운 순간</em>이 필요해요.','화면 속 작은 친구가 일상 가까이에.<br>좋아하는 마음을 담은 굿즈를 준비하고 있어요.','굿즈 이야기 만나기','#goods'],['마음을 그리는,<br>손꿈이의 <em>작은 작업실.</em>','다정한 표정, 따뜻한 한마디.<br>캐릭터에 담은 이야기를 만나보세요.','작가 만나보기','#artist']];
function changeSlide(delta){slide=(slide+delta+slides.length)%slides.length;const s=slides[slide];$('#hero-title').innerHTML=s[0];$('#hero-description').innerHTML=s[1];$('#hero-link').innerHTML=s[2]+' <span>↗</span>';$('#hero-link').href=s[3];$('#hero-position').innerHTML=`0${slide+1} <i>/ 03</i>`;}
$('#hero-prev').onclick=()=>changeSlide(-1);$('#hero-next').onclick=()=>changeSlide(1);
$('#menu-toggle').onclick=()=>{const open=$('#main-nav').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',open);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('nav details').forEach(x=>x.open=false);$('#main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}});
document.querySelectorAll('nav a,nav button').forEach(x=>x.addEventListener('click',()=>{$('#main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');x.closest('details').open=false;}));
$('#back-top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});window.addEventListener('scroll',()=>$('#back-top').hidden=window.scrollY===0,{passive:true});
window.addEventListener('kk-content-ready',render);
render();
// 운영 모드에서는 읽기 실패나 빈 목록을 기획 예시로 대체하지 않습니다.
KKAuth.settings().then(async config=>{
 if(!config.databaseURL)return;
 KK.setRemoteWorks([]);render();$('#result-count').textContent='공개 작품을 불러오고 있어요…';
 try{KK.setRemoteWorks(await KKPages.publicWorks());render();}
 catch(error){$('#art-grid').textContent='공개 작품을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';$('#result-count').textContent='데이터베이스 연결 확인 필요';}
}).catch(()=>{});
