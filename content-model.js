'use strict';
window.KKContentModel=(()=>{
 const goodsIds=['keyring','sticker','postcard',...Array.from({length:6},(_,i)=>'goods-'+(i+4))];
 const seeds={};
 function add(id,title,summary,body,kind='yellow'){seeds[id]={title,summary,body,kind,image:'',alt:title,link:'',button:'자세히 보기',fit:'contain'};}
 add('collection-notice','작품 목록 안내 문구','창작 기획 예시 · 실제 판매 작품이 아닙니다','메인 화면 요약 칸에 표시할 문구를 입력하세요. 비우면 문구를 숨깁니다.');
 for(const [id,name] of [['keyring','키링'],['sticker','스티커'],['postcard','엽서']])add(id+'-badge',name+' 상태 표시','기획 중','메인 화면 요약 칸에 준비 중, 판매 중 등 원하는 상태 문구를 입력하세요. 실제 주문 가능 여부는 상품 운영 설정에서 관리합니다.');
 add('hero','작은 표정 하나가, 오늘의 마음을 대신해요.','말로 다 전하지 못한 마음도 괜찮아요.\n나를 닮은 귀여운 친구가 대신 전해줄 거예요.','꾸미콘의 캐릭터와 이야기를 만나보세요.');
 seeds.hero.image='images/꾸미콘로고2.png';
 add('hero-goods','소소한 일상에도, 귀여운 순간이 필요해요.','화면 속 작은 친구가 일상 가까이에.','좋아하는 마음을 담은 굿즈를 준비하고 있어요.');
 add('hero-artist','마음을 그리는, 손꿈이의 작은 작업실.','다정한 표정, 따뜻한 한마디.','캐릭터에 담은 이야기를 만나보세요.','rabbit');
 add('side-goods','소소한 하루에 귀여움을 더해요.','굿즈 이야기','일상 가까이에서 함께할 친구들을 준비하고 있습니다.','rabbit');
 add('side-artist','마음을 그리는 손꿈이의 작업실','작가 이야기','작은 표정에 다정한 이야기를 담습니다.','rabbit');
 add('collection','어떤 마음을 전하고 싶나요?','당신의 하루에 살며시 찾아온, 작고 다정한 친구들.','마음에 드는 친구를 눌러 이야기를 읽어 보세요.');
 add('goods','화면 밖에서도, 늘 함께','좋아하는 마음을 일상 가까이에. 꾸미콘 굿즈를 준비하고 있어요.','키링, 스티커, 엽서 등 캐릭터 굿즈를 기획하고 있습니다.\n출시 일정과 가격은 확정 후 안내합니다.');
 add('keyring','어디든 함께, 아크릴 키링','나의 가방에 달아두는 작은 응원','가방과 열쇠에 달아 일상을 함께하는 캐릭터 키링을 기획하고 있습니다.\n\n소재·크기·가격·배송 일정은 준비 후 안내합니다. 현재 판매 중인 상품이 아닙니다.');
 add('sticker','하루 한 장, 마음 스티커','평범한 일기장도 특별해지는 순간','다이어리와 편지에 마음을 더하는 스티커를 준비합니다.\n\n구성과 소재, 가격은 확정 후 안내합니다.','rabbit');
 add('postcard','마음을 보내는 엽서','오래 간직하고 싶은 다정한 말','짧은 인사에도 따뜻함을 담아 전하는 엽서를 기획합니다.\n\n규격·인쇄 방식·가격은 준비 후 안내합니다.','bean');
 add('artist','안녕하세요, 마음을 그리는 손꿈이입니다.','작은 표정 하나가, 오늘의 마음을 대신해요.\n캐릭터와 굿즈, 그리고 우리들의 이야기가 모이는 곳.','이모티콘 작가이자 캐릭터·굿즈 크리에이터 손꿈이의 공간입니다.\n\n작은 표정으로 마음이 전해지는 순간을 꾸미콘에 담고 있습니다. 협업 문의는 홈페이지의 작가 이메일로 보내주세요.','rabbit');
 add('news','작업실에서 전하는 소식','새로운 만남과 소소한 이야기를 모았어요.','작업실에서 준비하는 새로운 이야기를 전합니다.');
 add('welcome','꾸미콘의 작은 작업실에 오신 걸 환영해요','안내','작가 손꿈이의 캐릭터 작업실에 오신 것을 환영합니다.\n현재 캐릭터 컬렉션은 창작 기획 예시이며, 실제 승인 작품과 판매 정보는 준비 후 안내합니다.');
 add('preview','새로운 친구들을 미리 만나보세요','작품','친구들의 이름을 누르면 상세한 이야기를 볼 수 있습니다. 하트 버튼으로 좋아하는 친구를 이 브라우저에 저장해 보세요.');
 add('goods-news','일상에 귀여움을 더할 굿즈를 준비하고 있어요','굿즈','키링·스티커·엽서를 준비하고 있습니다. 출시 일정은 확정 후 이곳에서 안내합니다.');
 add('world','꾸미콘의 작은 세계','저마다의 속도로 살아가는 작은 친구들','낙천적인 꾸미, 다정한 몽실, 느긋한 포근.\n캐릭터 컬렉션에서 작은 친구들의 이야기를 만나보세요.');
 add('lounge','우리의 작은 팬 라운지','좋아하는 마음을 함께 나눠요','팬아트를 나누는 공간을 준비하고 있어요. 지금은 작품을 둘러보고 마음에 드는 친구를 찜할 수 있습니다.');
 add('community','좋아하는 마음이 모이는 곳 ♡','우리의 작은 세계에 함께해 주세요.','꾸미콘의 친구가 되어 주세요.');
 add('terms','이용 안내 · 운영 전 검토용','서비스 이용 안내','작품과 굿즈는 현재 기획 예시입니다. 자체 결제나 구매는 지원하지 않습니다. 정식 이용약관은 운영 시작 전 확정이 필요합니다.');
 add('privacy','개인정보 안내 · 운영 전 검토용','개인정보 처리 안내','회원가입 정보는 Firebase 인증 서비스에서 처리합니다. 비밀번호는 사이트 코드나 콘텐츠에 저장하지 않습니다. 프로필 저장 시 닉네임을 데이터베이스에 저장합니다. 찜 목록은 이 브라우저에 저장됩니다. 정식 보관·삭제 절차는 운영 전 확정이 필요합니다.');
 for(let i=4;i<=9;i++){add('goods-'+i,'새 굿즈 '+i,'','상품의 구성과 소재, 주문 안내를 입력해 주세요.');add('goods-'+i+'-badge','굿즈 '+i+' 상태 표시','준비 중','원하는 상태 문구를 입력하세요.');}
 function safeImage(value){return typeof value==='string'&&( /^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value)||/^https:\/\/[^\s]+$/.test(value)||/^images\/[\w가-힣. -]+$/.test(value))?value:'';}
 function safeLink(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
 function tags(value){return [...new Set(String(value??'').split(/[,，\n]+/).map(x=>x.trim().replace(/^#+/,'')).filter(Boolean))];}
 function validate(v){if(v.tags!==undefined&&(typeof v.tags!=='string'||v.tags.length>200||tags(v.tags).length>10||tags(v.tags).some(t=>t.length>20)))throw Error('태그는 쉼표로 구분해 10개까지, 각각 20자 이내로 입력해 주세요.');if(!v.title?.trim()||v.title.length>100||v.summary.length>600||v.body.length>12000||v.alt.length>150||v.button.length>40)throw Error('제목 100자, 요약 600자, 본문 12,000자 이내로 입력해 주세요.');if(v.image&&(!safeImage(v.image)||v.image.length>450000))throw Error('지원하지 않는 이미지이거나 이미지 용량이 큽니다.');if(v.link&&!safeLink(v.link))throw Error('버튼 주소는 https://로 시작하는 올바른 주소를 입력해 주세요.');return v;}
 return {goodsIds,seeds,safeImage,safeLink,validate,tags};
})();
