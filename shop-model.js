'use strict';
window.KKShopModel=(()=>{
 const products=[{id:'keyring',name:'어디든 함께, 아크릴 키링',kind:'yellow',description:'가방에 달아두는 작은 응원',price:null,mode:'prepare',url:'',days:''},{id:'sticker',name:'하루 한 장, 마음 스티커',kind:'rabbit',description:'일기장에 붙이는 다정한 순간',price:null,mode:'prepare',url:'',days:''},{id:'postcard',name:'마음을 보내는 엽서',kind:'bean',description:'오래 간직하고 싶은 한마디',price:null,mode:'prepare',url:'',days:''}];
 const faqs=[['주문·결제','어떻게 주문하나요?','상품의 운영 방식에 따라 주문 요청을 접수하거나 외부 판매처에서 구매합니다. 이 홈페이지에서는 카드결제를 진행하지 않습니다.'],['주문·결제','주문 요청을 보내면 결제된 건가요?','아닙니다. 수량과 제작 가능 여부를 관리자가 확인하는 요청입니다. 최종 금액과 결제 방법을 안내받은 후 진행해 주세요.'],['제작·배송','배송 일정은 어디서 확인하나요?','배송 안내에는 관리자가 등록한 상품별 제작 안내를 표시합니다. 실제 주문의 상태와 운송장 번호는 주문·배송 화면에서 확인하세요.'],['제작·배송','출고일과 도착일은 같은가요?','출고는 제작처에서 택배사로 상품을 전달하는 단계입니다. 실제 도착일은 배송 상황에 따라 달라집니다.'],['쿠폰·혜택','쿠폰은 어떻게 사용하나요?','공개된 쿠폰 코드를 장바구니에 입력하면 적용 가능 여부와 예상 혜택을 확인할 수 있습니다. 주문 요청의 할인은 관리자가 최종 확인하며, 외부 판매처 적용 여부는 해당 판매처 안내를 따릅니다.'],['취소·교환','주문 요청을 취소하고 싶어요.','작가 이메일로 주문 번호와 함께 문의해 주세요. 제작 시작 여부를 확인한 후 처리합니다. 확정된 취소·교환 정책은 구매 전 확인해 주세요.'],['회원·문의','주문 내역이 안 보여요.','주문을 접수한 동일한 이메일 계정으로 로그인했는지 확인하세요. 외부 판매처에서 구매한 주문은 해당 판매처에서 조회합니다.'],['회원·문의','협업이나 대량 제작 문의는 어떻게 하나요?','작가 이메일 sp0823@naver.com으로 상품 종류·수량·희망 일정 등을 보내주세요. 제작 가능 여부와 견적은 상담 후 안내합니다.']];
 const statuses={requested:'요청 접수',confirmed:'주문 확인',making:'제작 중',shipped:'배송 중',completed:'완료',cancelled:'취소'};
 function money(n){return Number.isFinite(n)?n.toLocaleString('ko-KR')+'원':'가격 준비 중';}
 function cart(raw){if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};return Object.fromEntries(products.filter(p=>Number.isInteger(raw[p.id])&&raw[p.id]>0&&raw[p.id]<=99).map(p=>[p.id,raw[p.id]]));}
 function safeURL(raw){try{const url=new URL(raw);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}}
 function quote(items,catalog,coupon,now=Date.now()){
  const rows=Object.entries(cart(items)).map(([id,qty])=>({...(catalog.find(p=>p.id===id)||products.find(p=>p.id===id)),qty}));
  const priced=rows.every(p=>Number.isInteger(p.price)&&p.price>=0);const subtotal=priced?rows.reduce((n,p)=>n+p.price*p.qty,0):null;
  const valid=!!(coupon&&coupon.active&&coupon.code&&Date.parse(coupon.start+'T00:00:00+09:00')<=now&&Date.parse(coupon.end+'T23:59:59+09:00')>=now&&subtotal!==null&&subtotal>=coupon.minimum);
  const discount=valid?Math.min(subtotal,coupon.type==='percent'?Math.floor(subtotal*coupon.value/100):coupon.value):0;
  return {rows,subtotal,discount,total:subtotal===null?null:subtotal-discount,valid};
 }
 function sales(orders){const paid=orders.filter(o=>o.paymentStatus==='paid'&&o.status!=='cancelled'&&Number.isInteger(o.confirmedAmount)&&o.confirmedAmount>=0);return {count:paid.length,amount:paid.reduce((n,o)=>n+o.confirmedAmount,0)};}
 function delivery(raw){
  const limits={recipient:50,phone:30,postalCode:10,address:200,addressDetail:150},out={};
  for(const [key,max] of Object.entries(limits)){out[key]=String(raw[key]||'').trim();if(out[key].length>max||(!out[key]&&key!=='addressDetail'))throw Error('받는 사람, 연락처, 우편번호와 주소를 확인해 주세요.');}
  if(!/^[0-9+() -]{7,30}$/.test(out.phone)||!/^\d{5}$/.test(out.postalCode))throw Error('연락처와 5자리 우편번호를 확인해 주세요.');
  return out;
 }
 return {delivery,products,faqs,statuses,money,cart,safeURL,quote,sales};
})();
