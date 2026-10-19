'use strict';
(()=>{
 const entries=[['products','굿즈 쇼핑'],['orders','주문·배송'],['shipping','배송 안내'],['events','이벤트'],['cart','장바구니'],['coupons','쿠폰함'],['faq','자주 하는 질문']];
 const links=entries.map(([v,t])=>`<a href="shop.html?view=${v}">${t}</a>`).join('');
 const oldSales=document.querySelector('.admin-nav [data-page="sales"]');if(oldSales)oldSales.addEventListener('click',e=>{e.stopImmediatePropagation();location.href='shop.html?view=sales';},true);
 if(document.querySelector('.admin-nav'))document.querySelector('.admin-nav').insertAdjacentHTML('beforeend','<a class="button white" href="shop.html?view=fulfilment">주문·배송 관리</a><a class="button white" href="shop.html?view=manage">상품·이벤트·쿠폰 관리</a><a class="button white" href="shop.html?view=sales">확인 매출정보</a>');
 else{const main=document.querySelector('main');if(main)main.insertAdjacentHTML('afterbegin',`<nav class="service-nav" aria-label="쇼핑과 고객센터">${links}</nav>`);}
 const fab=document.createElement('button');fab.className='support-fab';fab.textContent='고객센터';fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-controls','support-panel');
 const panel=document.createElement('aside');panel.id='support-panel';panel.className='support-panel';panel.hidden=true;panel.innerHTML=`<h2>무엇을 도와드릴까요?</h2><nav>${links}<a href="mailto:sp0823@naver.com">작가에게 문의</a></nav>`;
 fab.onclick=()=>{panel.hidden=!panel.hidden;fab.setAttribute('aria-expanded',String(!panel.hidden));};document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.hidden=true;fab.setAttribute('aria-expanded','false');}});document.body.append(panel,fab);
})();
