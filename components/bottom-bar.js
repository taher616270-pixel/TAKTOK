// ملف الشريط السفلي - ثابت ومنفصل
export function renderBottomNav(active='home'){
  const nav=document.createElement('nav');
  nav.className='taktok-bottom-nav';
  nav.dir='rtl';
  nav.innerHTML=`
    <button class="nav-item ${active==='profile'?'active':''}" data-page="profile">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 19c0-3.5 3.5-6 7-6s7 2.5 7 6"/></svg>
      <span>الشخصي</span>
    </button>
    <button class="nav-item" data-page="shop">
      <div style="position:relative"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 9h14l-1 10H6L5 9z"/></svg><span class="badge">27</span></div>
      <span>متجر القرب</span>
    </button>
    <button class="nav-item center" data-page="create"><div class="plus-btn"></div></button>
    <button class="nav-item" data-page="live">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      <span>البثه</span>
    </button>
    <button class="nav-item ${active==='home'?'active':''}" data-page="home">
      <svg viewBox="0 0 24 24" fill="${active==='home'?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M3 9L12 2l9 7v11a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9z"/></svg>
      <span>الصفحة الرئيسية</span>
    </button>
  `;
  return nav;
}
