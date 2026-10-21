'use strict';
(()=>{
 const dialog=document.createElement('dialog');dialog.className='inquiry-dialog';dialog.setAttribute('aria-labelledby','inquiry-title');
 dialog.innerHTML=`<button type="button" class="dialog-close" aria-label="문의 창 닫기">×</button><h2 id="inquiry-title">작가에게 문의</h2><p>받는 사람: <strong>sp0823@naver.com</strong></p><form><label class="field">이름 / 회사명<input name="name" autocomplete="name" required maxlength="80"></label><label class="field">회신 이메일<input name="email" type="email" autocomplete="email" required maxlength="150"></label><label class="field">문의 제목<input name="subject" required maxlength="100"></label><label class="field">협업 내용<textarea name="collaboration" rows="3" maxlength="800" placeholder="협업 목적과 진행하고 싶은 내용을 적어 주세요."></textarea></label><label class="field">희망 일정<input name="schedule" maxlength="150" placeholder="예: 11월 중 / 날짜 미정 / 협의 가능"></label><label class="field">상품 종류와 수량<textarea name="products" rows="2" maxlength="400" placeholder="예: 아크릴 키링 100개, 스티커 200장"></textarea></label><label class="field">기타 문의사항<textarea name="other" rows="3" maxlength="650" placeholder="추가로 궁금한 내용을 적어 주세요."></textarea></label><small>협업 내용 또는 기타 문의사항 중 하나를 입력해 주세요. 일정·상품은 미정이면 비워 두셔도 됩니다.</small><p>입력하신 이름·이메일·문의 내용은 Formspree를 통해 작가에게 전달됩니다.</p><div class="inquiry-actions"><button class="button yellow" type="submit">문의 보내기</button><button class="button white" type="button" data-copy>문의 내용 복사</button></div><p role="status" class="inquiry-status"></p><small>전송 오류가 발생하면 입력 내용이 유지됩니다. 필요하면 내용을 복사해 위 이메일로 보내실 수 있습니다.</small></form>`;
 document.body.append(dialog);let trigger,sending=false;
 const form=dialog.querySelector('form'),status=dialog.querySelector('[role=status]');
 const valid=()=>{if(!form.reportValidity())return false;if(!form.elements.collaboration.value.trim()&&!form.elements.other.value.trim()){status.textContent='협업 내용 또는 기타 문의사항을 입력해 주세요.';form.elements.collaboration.focus();return false;}return true;};
 const body=()=>{const d=Object.fromEntries(new FormData(form));return `이름 / 회사명: ${d.name}
회신 이메일: ${d.email}

[협업 내용]
${d.collaboration.trim()||'미입력'}

[희망 일정]
${d.schedule.trim()||'미정 / 협의 필요'}

[상품 종류와 수량]
${d.products.trim()||'미정 / 해당 없음'}

[기타 문의사항]
${d.other.trim()||'없음'}`;};
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="mailto:sp0823@naver.com"]');if(!a)return;event.preventDefault();event.stopImmediatePropagation();trigger=a;dialog.querySelector('h2').textContent=a.textContent.includes('협업')?'협업 문의하기':'작가에게 문의';status.textContent='';if(!dialog.open)dialog.showModal();form.elements.name.focus();},true);
 dialog.querySelector('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>trigger?.focus());
 form.addEventListener('submit',async event=>{
  event.preventDefault();event.stopPropagation();if(sending||!valid())return;
  const submit=form.querySelector('[type="submit"]');sending=true;submit.disabled=true;submit.textContent='전송 중…';status.textContent='';
  let timer;try{
   const configResponse=await fetch('inquiry-config.json',{cache:'no-store'});if(!configResponse.ok)throw Error('문의 연결 설정을 불러오지 못했습니다.');
   const config=await configResponse.json();if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(config.endpoint||''))throw Error('메일 전송 연결 준비 중입니다. 잠시 후 다시 이용해 주세요.');
   const controller=new AbortController();timer=setTimeout(()=>controller.abort(),20000);
   const data=Object.fromEntries(new FormData(form));data.subject='[꾸미콘 문의] '+data.subject.replace(/[\r\n]/g,' ').trim();data.message=body();
   const response=await fetch(config.endpoint,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
   if(!response.ok)throw Error(response.status===429?'요청이 많습니다. 잠시 후 다시 보내 주세요.':'전송하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.');
   status.textContent='문의가 접수되었습니다. 작성하신 회신 이메일로 답변드리겠습니다.';form.reset();
  }catch(error){status.textContent=error.name==='AbortError'?'응답을 확인하지 못했습니다. 중복 접수를 피하려면 잠시 기다린 뒤 확인해 주세요.':error.message;}
  finally{clearTimeout(timer);sending=false;submit.disabled=false;submit.textContent='문의 보내기';}
 });
 dialog.querySelector('[data-copy]').onclick=async()=>{if(!valid())return;try{await navigator.clipboard.writeText('받는 사람: sp0823@naver.com\n제목: '+form.elements.subject.value+'\n\n'+body());status.textContent='복사했습니다. 메일에 붙여 넣어 보내 주세요.';}catch{status.textContent='복사 권한을 확인하거나 입력한 내용을 직접 선택하여 복사해 주세요.';}};
})();
