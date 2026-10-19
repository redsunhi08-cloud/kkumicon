'use strict';
(() => {
 const model=KKContentModel,e=KK.escape;let records={},isAdmin=false,active='',draftImage='',imageBusy=false,dirty=false,slideIndex=0;
 const workSeeds=Object.fromEntries(KK.seed.map(w=>['work-'+w.id,{title:w.name,summary:w.description,body:'이 캐릭터는 창작 기획 예시입니다.\n실제 승인 작품과 판매 정보는 준비 후 안내합니다.',image:'',alt:w.name,kind:w.kind,fit:'contain',link:'',button:'작품 만나보기'}]));
 const seeds={...model.seeds,...workSeeds};
 const get=id=>({...seeds[id],...records[id]});
 window.KKContentLookup=work=>records['work-'+work.id]?{...work,name:get('work-'+work.id).title,description:get('work-'+work.id).summary}:work;
 const picture=(r,cls='cms-image')=>model.safeImage(r.image)?`<img class="${cls}" src="${e(model.safeImage(r.image))}" alt="${e(r.alt||r.title)}" style="object-fit:${r.fit==='cover'?'cover':'contain'}" loading="lazy">`:KK.character(r.kind||'yellow',r.alt||r.title);
 const url=id=>'detail.html?id='+encodeURIComponent(id);
 function text(selector,value){const n=document.querySelector(selector);if(n&&n.textContent!==value)n.textContent=value;}
 function applyHome(){
  if(!document.querySelector('#main'))return;
  const heroId=['hero','hero-goods','hero-artist'][slideIndex],hero=get(heroId);
  const heroArt=document.querySelector('.hero-art');heroArt.dataset.content=heroId;heroArt.setAttribute('role','link');heroArt.tabIndex=0;heroArt.setAttribute('aria-label','메인 배너 이야기 보기');
  const heroImage=heroArt.querySelector('img');heroImage.src=model.safeImage(hero.image)||'images/꾸미콘로고2.png';heroImage.alt=hero.alt;
  if(records[heroId]){text('#hero-title',hero.title);text('#hero-description',hero.summary);document.querySelector('#hero-title').classList.add('cms-custom');}
  for(const [id,selector] of [['collection','#collection .section-heading'],['goods','#goods .section-heading'],['artist','.artist-copy'],['news','.news-layout>div'],['community','.community-banner']]){
   if(!records[id])continue;const r=get(id);text(selector+' h2',r.title);text(selector+' p',r.summary);
   if(id==='artist'&&r.image)document.querySelector('#artist-character').innerHTML=picture(r);
  }
  for(const [id,selector] of [['side-goods','.hero-side.peach'],['side-artist','.hero-side.sky']])if(records[id]){const r=get(id);text(selector+' p',r.title);const node=document.querySelector(selector+' #side-character')||document.querySelector(selector+' .drawing-icon');if(r.image&&node)node.innerHTML=picture(r);}
  document.querySelectorAll('.goods-card').forEach((node,i)=>{const id=['keyring','sticker','postcard'][i],r=get(id);node.dataset.content=id;node.removeAttribute('data-info');if(records[id]){node.querySelector('h3').textContent=r.title;node.querySelector('p').textContent=r.summary;if(r.image)node.querySelector('.goods-art').innerHTML=picture(r);}});
  document.querySelectorAll('.news-list button').forEach((node,i)=>{const id=['welcome','preview','goods-news'][i];node.dataset.content=id;node.removeAttribute('data-info');if(records[id])node.querySelector('span:nth-child(2)').textContent=get(id).title;});
  document.querySelectorAll('[data-work]').forEach(node=>{const id='work-'+node.dataset.work;if(!records[id])return;const r=get(id);if(node.classList.contains('art-open')){node.innerHTML=picture(r);node.setAttribute('aria-label',r.title+' 작품 상세 보기');}const h=node.querySelector('h3');if(h)h.textContent=r.title;const card=node.closest('.art-card');if(card)card.querySelector('.art-caption').textContent=r.summary;});
 }
 function renderDetail(){
  const root=document.querySelector('#story-page');if(!root)return;
  const id=new URLSearchParams(location.search).get('id')||'world';
  if(!seeds[id]){root.innerHTML='<h1>이야기를 찾을 수 없어요</h1><a href="index.html">홈페이지로 돌아가기</a>';return;}
  const r=get(id);document.title=r.title+' · 꾸미콘';
  root.innerHTML=`<a class="text-link" href="index.html">HOME / 꾸미콘 이야기</a><article><div class="story-hero"><div class="story-picture">${picture(r)}</div><div class="story-copy"><span class="eyebrow">KKUMICON · LITTLE STORIES</span><h1>${e(r.title)}</h1><p>${e(r.summary)}</p>${model.safeLink(r.link)?`<a class="button yellow" href="${e(model.safeLink(r.link))}" target="_blank" rel="noopener noreferrer">${e(r.button||'자세히 보기')} ↗</a>`:''}${id.startsWith('work-')?`<button class="button white" id="story-wish">찜하기 / 해제 ♡</button><p id="story-wish-status" role="status"></p>`:''}${isAdmin?`<button class="cms-edit cms-detail-button" data-edit-content="${e(id)}">이미지·내용 수정 ✎</button>`:''}</div></div><div class="story-body">${e(r.body)}</div></article><nav class="story-related" aria-label="다른 이야기"><a class="button white" href="index.html#collection">캐릭터 컬렉션</a><a class="button white" href="${url('goods')}">굿즈 이야기</a><a class="button white" href="${url('artist')}">작가 소개</a></nav>`;
  const wish=document.querySelector('#story-wish');if(wish)wish.onclick=()=>{const key=id.slice(5),old=KK.read('kk-wishes',[]),list=Array.isArray(old)?old:[],next=list.includes(key)?list.filter(x=>x!==key):[...list,key];document.querySelector('#story-wish-status').textContent=KK.write('kk-wishes',next)?(next.includes(key)?'찜했습니다.':'찜을 해제했습니다.'):'저장 공간을 사용할 수 없습니다.';};
 }
 const dialog=document.createElement('dialog');dialog.className='cms-dialog';dialog.id='cms-editor';
 dialog.innerHTML=`<form id="cms-form"><h2>이미지와 이야기 수정</h2><p>저장하면 홈페이지와 상세페이지에 함께 반영됩니다.</p><div class="cms-editor-grid"><div><div id="cms-preview" class="story-picture"></div><label>이미지 파일 선택<input id="cms-file" type="file" accept="image/png,image/jpeg,image/webp"></label><small>PNG·JPG·WebP, 원본 10MB 이하. 저장용으로 자동 축소합니다.</small><button type="button" class="cms-edit" id="cms-remove-image">기본 이미지 사용</button><label>이미지 표시<select id="cms-fit"><option value="contain">전체 보이기 (잘림 없음)</option><option value="cover">영역 채우기 (일부 잘림)</option></select></label><label>이미지 설명<input id="cms-alt" maxlength="150"></label></div><div><label>제목<input id="cms-title" required maxlength="100"></label><label>메인 화면 요약<textarea id="cms-summary" maxlength="600"></textarea></label><label>상세페이지 본문<textarea id="cms-body" rows="9" maxlength="12000"></textarea></label><label>외부 버튼 주소 (선택)<input id="cms-link" type="url" placeholder="https://..."></label><label>버튼 이름<input id="cms-button" maxlength="40"></label></div></div><p class="cms-status" id="cms-status" role="status"></p><div class="cms-actions"><button class="button white" type="button" id="cms-cancel">취소</button><button class="button yellow" id="cms-save" type="submit">Firebase에 저장</button></div></form>`;
 document.body.append(dialog);const field=id=>dialog.querySelector('#cms-'+id);
 function previewImage(){field('preview').innerHTML=picture({...get(active),image:draftImage,fit:field('fit').value});}
 function edit(id){if(!isAdmin||!seeds[id])return;active=id;dirty=false;const r=get(id);draftImage=r.image||'';for(const key of ['title','summary','body','alt','link','button','fit'])field(key).value=r[key]||'';field('file').value='';field('status').textContent='';previewImage();dialog.showModal();field('title').focus();}
 async function convertImage(file){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw Error('10MB 이하의 PNG·JPG·WebP 이미지를 선택해 주세요.');
  const bitmap=await createImageBitmap(file);try{const scale=Math.min(1,1000/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);for(const q of [.85,.7,.5,.35]){const value=canvas.toDataURL('image/webp',q);if(value.length<=450000&&model.safeImage(value))return value;}throw Error('축소 후에도 이미지가 큽니다. 더 단순하거나 작은 이미지를 선택해 주세요.');}finally{bitmap.close();}
 }
 field('file').onchange=async()=>{const file=field('file').files[0];if(!file)return;imageBusy=true;field('save').disabled=true;field('status').textContent='이미지를 준비하고 있어요…';try{draftImage=await convertImage(file);dirty=true;previewImage();field('status').textContent='이미지 준비 완료. 저장 버튼을 눌러 반영하세요.';}catch(error){field('status').textContent=error.message;}finally{imageBusy=false;field('save').disabled=false;}};
 field('remove-image').onclick=()=>{draftImage='';dirty=true;field('file').value='';previewImage();};field('fit').onchange=previewImage;
 function closeEditor(){if(imageBusy)return;if(!dirty||confirm('저장하지 않은 변경 사항을 닫을까요?'))dialog.close();}
 field('cancel').onclick=closeEditor;dialog.addEventListener('cancel',event=>{event.preventDefault();closeEditor();});field('form').addEventListener('input',()=>dirty=true);
 field('form').onsubmit=async event=>{event.preventDefault();if(!isAdmin||imageBusy)return;field('save').disabled=true;field('cancel').disabled=true;field('status').textContent='Firebase에 저장 중입니다…';
  try{const value={};for(const key of ['title','summary','body','alt','link','button','fit'])value[key]=field(key).value.trim();value.image=draftImage;model.validate(value);await KKPages.saveContent(active,value);records[active]=value;dirty=false;window.dispatchEvent(new Event('kk-content-ready'));applyHome();renderDetail();dialog.close();const status=document.querySelector('#cms-global-status');if(status)status.textContent='저장 완료 · 다른 화면은 새로고침하면 반영됩니다.';}
  catch(error){field('status').textContent=error.message+'\n규칙을 갱신하지 않았다면 firebase-pages.rules.json을 Firebase 규칙 탭에 게시해 주세요. 입력한 내용은 유지됩니다.';}finally{field('save').disabled=false;field('cancel').disabled=false;}
 };
 document.addEventListener('click',event=>{
  const editButton=event.target.closest('[data-edit-content]');if(editButton){event.preventDefault();edit(editButton.dataset.editContent);return;}
  const target=event.target.closest('[data-content],[data-info],[data-work]');if(!target)return;
  const id=target.dataset.content||target.dataset.info||(target.dataset.work?'work-'+target.dataset.work:'');
  if(!seeds[id])return;event.preventDefault();event.stopImmediatePropagation();location.href=url(id);
 },true);
 document.querySelector('#hero-prev')?.addEventListener('click',()=>{slideIndex=(slideIndex+2)%3;applyHome();});document.querySelector('#hero-next')?.addEventListener('click',()=>{slideIndex=(slideIndex+1)%3;applyHome();});
 window.addEventListener('kk-render',applyHome);
 document.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.matches('.hero-art[data-content]'))location.href=url(event.target.dataset.content);});
 document.addEventListener('error',event=>{const image=event.target;if(image.tagName==='IMG'&&image.classList.contains('cms-image')){const fallback=document.createElement('span');fallback.textContent='이미지를 불러오지 못했어요';fallback.className='cms-message';image.replaceWith(fallback);}},true);
 window.addEventListener('beforeunload',event=>{if(dialog.open&&dirty){event.preventDefault();event.returnValue='';}});
 async function boot(){
  let loadError='';try{records=await KKPages.siteContent();}catch(error){loadError=error.message;}
  // 작품명과 소개는 기존 공개 데이터도 기본값에 반영합니다.
  try{for(const w of await KKPages.publicWorks()){workSeeds['work-'+w.id].title=w.name;workSeeds['work-'+w.id].summary=w.description;Object.assign(seeds['work-'+w.id],workSeeds['work-'+w.id]);}}catch{}
  window.dispatchEvent(new Event('kk-content-ready'));applyHome();renderDetail();
  if(KKAuth.session())try{await KKPages.overview();isAdmin=true;}catch{}
  if(isAdmin){const bar=document.createElement('aside');bar.className='cms-bar';bar.innerHTML=`<strong>작가 편집 모드</strong><label>수정할 영역 <select id="cms-section">${Object.entries(seeds).map(([id,r])=>`<option value="${e(id)}">${e(r.title)}</option>`).join('')}</select></label><button id="cms-open">이미지·내용 수정 ✎</button><a href="admin.html">관리자 대시보드</a><span id="cms-global-status" role="status">${e(loadError?'기존 콘텐츠 조회 실패 · 규칙 갱신을 확인하세요.':'수정할 영역을 선택하거나 상세페이지에서 편집하세요.')}</span>`;document.body.prepend(bar);bar.querySelector('#cms-open').onclick=()=>edit(bar.querySelector('select').value);renderDetail();}
  else if(loadError&&document.querySelector('#story-page')){const p=document.createElement('p');p.className='cms-message';p.textContent='저장된 콘텐츠를 불러오지 못해 기본 안내를 표시합니다. 잠시 후 새로고침해 주세요.';document.querySelector('#story-page').prepend(p);}
 }
 boot();
})();
