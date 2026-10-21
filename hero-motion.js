'use strict';
(()=>{
 const hero=document.querySelector('.hero-main'),next=document.querySelector('#hero-next'),controls=document.querySelector('.hero-controls');
 if(!hero||!next||!controls)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.createElement('button');toggle.type='button';toggle.className='hero-play';controls.append(toggle);
 let timer,paused=false,hover=false;
 function restart(){
  clearTimeout(timer);hero.classList.remove('hero-playing');
  const playing=!paused&&!hover&&!document.hidden&&!reduce.matches&&!document.querySelector('dialog[open]')&&!hero.contains(document.activeElement);
  toggle.textContent=paused?'▶ 재생':'Ⅱ 일시정지';
  toggle.setAttribute('aria-label',paused?'히어로 자동재생 시작':'히어로 자동재생 일시정지');
  toggle.setAttribute('aria-pressed',String(paused));
  if(reduce.matches){toggle.textContent='자동재생 꺼짐';toggle.disabled=true;return;}toggle.disabled=false;
  if(!playing)return;
  void hero.offsetWidth;
  hero.classList.add('hero-playing');
  timer=setTimeout(()=>{next.click();},6500);
 }
 toggle.addEventListener('click',()=>{paused=!paused;restart();});
 hero.addEventListener('mouseenter',()=>{hover=true;restart();});
 hero.addEventListener('mouseleave',()=>{hover=false;restart();});
 hero.addEventListener('focusin',restart);hero.addEventListener('focusout',()=>setTimeout(restart,0));
 document.addEventListener('visibilitychange',restart);reduce.addEventListener('change',restart);
 document.querySelector('#hero-prev').addEventListener('click',restart);next.addEventListener('click',restart);
 new MutationObserver(restart).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 restart();
})();
