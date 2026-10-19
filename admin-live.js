'use strict';
// 실제 서버에서 권한 확인을 통과했을 때만 사용하는 화면입니다.
window.KKAdminLive = (() => {
  const esc = KK.escape;
  function heading(title, description) {
    return `<div class="admin-heading"><div><h1>${title}</h1><p>${description}</p></div><button class="button white" data-refresh-admin>권한 다시 확인 ↻</button></div>`;
  }
  function render(page, data) {
    if (page === 'overview') {
      return heading('관리자 작업실에 오신 걸 환영합니다', 'Firebase 인증과 관리자 권한을 서버에서 확인했습니다.') + `
        <div class="stats-grid">
          <article class="stat-card"><span>관리자 인증</span><strong style="font-size:23px">확인 완료</strong><small>서명·유효기간·계정 확인</small></article>
          <article class="stat-card"><span>운영 작품</span><strong style="font-size:23px">미연결</strong><small>작품 데이터베이스 연결 필요</small></article>
          <article class="stat-card"><span>전체 회원</span><strong style="font-size:23px">미연결</strong><small>전체 회원 조회 API 연결 필요</small></article>
          <article class="stat-card"><span>매출</span><strong style="font-size:23px">미연결</strong><small>결제 서비스 연결 필요</small></article>
        </div>
        <div class="dashboard-grid"><section class="panel"><h2>확인된 관리자 계정</h2>
          <div class="system-row"><span>닉네임</span><span>${esc(data.user.displayName || '미설정')}</span></div>
          <div class="system-row"><span>이메일</span><span style="overflow-wrap:anywhere">${esc(data.user.email)}</span></div>
          <div class="system-row"><span>Firebase 프로젝트</span><span>${esc(data.projectId)}</span></div>
          <div class="system-row"><span>관리자 권한</span><span>admin: true</span></div>
        </section><section class="panel"><h2>현재 연결 범위</h2>
          <p>일반 회원 로그인과 관리자 접근 확인이 연결되었습니다. 작품·회원 목록·매출 데이터는 아직 연결하지 않았습니다.</p>
          <p>기존 캐릭터 기획을 편집하려면 미리보기를 이용하세요. 해당 편집은 이 브라우저에만 저장됩니다.</p>
          <a class="button white" href="admin.html?preview=1">기획 작품 미리보기 ↗</a>
        </section></div>`;
    }
    if (page === 'service') {
      return heading('서비스 연결 상태', '로컬 관리자 서버의 확인 결과입니다.') + `<section class="panel"><h2>연결 현황</h2>
        <div class="system-row"><span>Firebase 로그인</span><span>확인 완료</span></div>
        <div class="system-row"><span>서버의 관리자 권한 검사</span><span>확인 완료</span></div>
        <div class="system-row"><span>실행 환경</span><span>이 컴퓨터의 로컬 서버</span></div>
        <div class="system-row"><span>작품·전체 회원 데이터</span><span>미연결</span></div>
        <div class="system-row"><span>결제·매출</span><span>미연결</span></div>
        <div class="system-row"><span>Netlify 관리자 서버 배포</span><span>미실행</span></div>
        <p class="notice">Firebase 데이터베이스 규칙과 외부 배포 설정은 변경하지 않았습니다.</p></section>`;
    }
    const content = page === 'content';
    const title = content ? '운영 작품 데이터 연결이 필요합니다' : page === 'members' ? '전체 회원 조회 연결이 필요합니다' : '결제·매출 연결이 필요합니다';
    return heading(title,'관리자 인증은 완료되었습니다. 해당 데이터 서비스는 별도 연결 단계입니다.') + `<section class="panel admin-empty"><span class="empty-icon">${content?'▧':'▤'}</span><h2>아직 연결된 데이터가 없습니다</h2><p>${content?'기획 예시의 브라우저 편집 기능은 기존 미리보기에서 사용할 수 있습니다.':'개인 계정의 로그인 정보만으로 전체 회원 목록이나 매출을 조회하지 않습니다.'}</p>${content?'<a class="button white" href="admin.html?preview=1">기획 작품 미리보기 ↗</a>':'<button class="button white" data-page="service">서비스 상태 보기</button>'}</section>`;
  }
  return { render };
})();
