'use strict';
window.KK = (() => {
  const seed = [
    ['C01','꿈꾸는 꾸미','오늘도 반짝! 작은 너의 하루를 응원해.','응원','yellow','#fff1bd'],
    ['C02','퇴근요정 퇴꾸','오늘도 수고했어. 이제 나만의 시간이야.','직장','fairy','#e9e5f4'],
    ['C03','말랑토끼 몽실','말하지 않아도 알아. 꼬옥 안아줄게.','사랑','rabbit','#fce7e9'],
    ['C04','집콕곰 포근','아무것도 안 해도 괜찮은 하루.','일상','bear','#eee4d7'],
    ['C05','수다냥 조잘','네 이야기가 궁금해! 오늘은 어땠어?','인사','cat','#e3eff2'],
    ['C06','작은용기 콩이','작은 한 걸음도 충분히 멋진 일이야.','응원','bean','#e4edda'],
    ['C07','먹보햄찌 냠이','맛있는 한 입에 행복이 가득!','일상','hamster','#ffebd4'],
    ['C08','햇살강아지 보리','네가 와서 정말 좋아. 고마워!','감사','dog','#f9edc9'],
    ['C09','마음구름 뭉게','마음이 흐린 날에도 곁에 있을게.','사랑','cloud','#e6edf7'],
    ['C10','꼬마농부 새봄','천천히 자라도 괜찮아.','감사','bean','#e8efda']
  ].map(([id,name,description,emotion,kind,bg])=>({id,name,description,emotion,kind,bg,visible:true}));
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
  let remoteWorks=null;function setRemoteWorks(items){remoteWorks=items;}function works(){if(remoteWorks!==null)return remoteWorks;const saved=read('kk-content',null);return Array.isArray(saved)?saved.filter(x=>seed.some(s=>s.id===x.id)).map(x=>({...seed.find(s=>s.id===x.id),name:String(x.name).slice(0,50),description:String(x.description).slice(0,300),visible:x.visible!==false})):seed.map(x=>({...x}));}
  function escape(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function character(kind='yellow',label='캐릭터 기획 일러스트') {
    const color={yellow:'#ffdf63',fairy:'#e1d4ee',rabbit:'#fffaf0',bear:'#c8a284',cat:'#f8f2e5',bean:'#c5d99e',hamster:'#efc696',dog:'#efdbb3',cloud:'#fffaf3'}[kind]||'#ffdf63';
    const ears=kind==='rabbit'?'<ellipse cx="88" cy="51" rx="18" ry="39" fill="#fffaf0"/><ellipse cx="143" cy="48" rx="17" ry="39" fill="#fffaf0"/><path d="M88 30v37M143 27v37" stroke="#f0c5c5" stroke-width="9"/>':kind==='cat'?'<path d="M61 104L62 45L104 74M134 74L173 45L178 106" fill="#f8f2e5"/>':['bear','hamster','dog'].includes(kind)?`<ellipse cx="64" cy="83" rx="25" ry="${kind==='dog'?42:24}" fill="${color}"/><ellipse cx="173" cy="83" rx="25" ry="${kind==='dog'?42:24}" fill="${color}"/>`:kind==='bean'?'<path d="M119 72Q85 67 91 41Q122 39 119 72Q119 33 151 36Q153 64 119 72" fill="#92b779"/>':kind==='fairy'?'<path d="M60 137Q3 86 24 151Q32 173 66 167M178 137Q233 86 211 151Q204 173 175 167" fill="#fffaf3"/>':'';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 230" role="img" aria-label="${escape(label)}"><ellipse cx="120" cy="211" rx="63" ry="8" fill="#73523b" opacity=".08"/><g stroke="#72563e" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${ears}<ellipse cx="120" cy="150" rx="64" ry="57" fill="${color}"/><ellipse cx="81" cy="198" rx="19" ry="11" fill="${color}"/><ellipse cx="157" cy="198" rx="19" ry="11" fill="${color}"/><path d="M65 152Q38 137 44 158Q48 171 63 172M178 149Q200 128 202 149Q198 165 181 169" fill="${color}"/><ellipse cx="120" cy="118" rx="70" ry="58" fill="${color}"/><path d="M92 113v9M145 113v9" stroke="#49382d" stroke-width="6"/><path d="M111 130Q119 142 129 130" fill="none"/><ellipse cx="76" cy="133" rx="12" ry="7" fill="#eea9a2" stroke="none"/><ellipse cx="162" cy="133" rx="12" ry="7" fill="#eea9a2" stroke="none"/><path d="M106 172Q119 159 133 172Q130 188 119 190Q108 186 106 172" fill="#f1a3a5" stroke="none"/></g><path d="M203 45l3 9 9 3-9 3-3 9-3-9-9-3 9-3zM28 87l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#d8ac4e"/></svg>`;
  }
  return {seed,read,write,works,escape,character,setRemoteWorks};
})();

