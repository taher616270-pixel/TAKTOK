const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem('tk_'+k))??d}catch{return d}},set(k,v){localStorage.setItem('tk_'+k,JSON.stringify(v))}};
let posts=store.get('posts',[]),following=store.get('following',[]),saved=store.get('saved',[]),activePost=null,activeTab='foryou',objectUrls=[];
const demo=[{id:'demo1',user:'taktok',caption:'مرحباً بك في TAKTOK ✨ شارك لحظاتك مع العالم',src:'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',likes:1200,music:'الصوت الأصلي',demo:true},{id:'demo2',user:'creator',caption:'جرب التمرير للأعلى لمشاهدة الفيديو التالي 🎬',src:'https://www.w3schools.com/html/mov_bbb.mp4',likes:842,music:'Original sound',demo:true}];
const all=()=>[...posts,...demo];
function icon(name){return ({heart:'♡',comment:'▢',save:'▣',share:'➤',more:'•••',music:'♫',volume:'♪',pause:'Ⅱ',play:'▶'})[name]}
function card(p){const el=document.createElement('article');el.className='video-card';el.dataset.id=p.id;el.innerHTML=`<video src="${p.src}" playsinline loop preload="metadata"></video><div class="video-gradient"></div><button class="sound-toggle" aria-label="الصوت">♪</button><button class="video-center" aria-label="تشغيل أو إيقاف">Ⅱ</button><div class="video-info"><div class="creator"><b>@${escapeHtml(p.user)}</b><button class="follow-btn" data-action="follow">${following.includes(p.user)?'✓':'متابعة'}</button></div><p class="caption">${escapeHtml(p.caption)}</p><div class="music-line">♫ ${escapeHtml(p.music||'الصوت الأصلي')}</div></div><div class="video-actions"><button class="avatar-action" data-action="profile"><img src="https://i.pravatar.cc/100?u=${encodeURIComponent(p.user)}"><i>＋</i></button><button data-action="like" class="${store.get('likes',[]).includes(p.id)?'liked':''}"><strong>${icon('heart')}</strong><small class="like-count">${fmt(p.likes||0)}</small></button><button data-action="comment"><strong>${icon('comment')}</strong><small>تعليق</small></button><button data-action="save" class="${saved.includes(p.id)?'saved':''}"><strong>${icon('save')}</strong><small>حفظ</small></button><button data-action="share"><strong>${icon('share')}</strong><small>مشاركة</small></button><button data-action="more"><strong>${icon('more')}</strong><small>المزيد</small></button><div class="disc">♫</div></div>`;
const v=el.querySelector('video');el.querySelector('.video-center').onclick=()=>{if(v.paused){v.play().catch(()=>{});el.querySelector('.video-center').textContent='Ⅱ'}else{v.pause();el.querySelector('.video-center').textContent='▶'}};
el.querySelector('.sound-toggle').onclick=()=>{v.muted=!v.muted;el.querySelector('.sound-toggle').textContent=v.muted?'♪':'🔊'};
el.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action; if(a==='like'){let l=store.get('likes',[]);const on=l.includes(p.id);l=on?l.filter(x=>x!==p.id):[...l,p.id];store.set('likes',l);b.classList.toggle('liked',!on);b.querySelector('strong').textContent=on?'♡':'♥';b.querySelector('.like-count').textContent=fmt((p.likes||0)+(on?-1:1));}if(a==='follow'){let f=following.includes(p.user);following=f?following.filter(x=>x!==p.user):[...following,p.user];store.set('following',following);b.textContent=f?'متابعة':'✓';toast(f?'تم إلغاء المتابعة':'أصبحت تتابع '+p.user)}if(a==='save'){saved=saved.includes(p.id)?saved.filter(x=>x!==p.id):[...saved,p.id];store.set('saved',saved);b.classList.toggle('saved',saved.includes(p.id));toast(saved.includes(p.id)?'تم حفظ الفيديو':'أزيل من المحفوظات')}if(a==='comment')openComments(p);if(a==='share')share(p);if(a==='more')openMore(p);if(a==='profile')openPanel('profile')});
let last=0;v.addEventListener('click',()=>{const now=Date.now();if(now-last<280){const btn=el.querySelector('[data-action="like"]');if(!btn.classList.contains('liked'))btn.click();}last=now});return el}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function fmt(n){return n>=1000000?(n/1e6).toFixed(1)+'M':n>=1000?(n/1e3).toFixed(1)+'K':n}
function render(){const feed=$('#feed');feed.innerHTML='';let list=all();if(activeTab==='following')list=list.filter(p=>following.includes(p.user));if(!list.length){feed.innerHTML='<div class="empty-feed">تابع بعض الحسابات ليظهر محتواهم هنا</div>';return}list.forEach(p=>feed.append(card(p)));observer();}
const observer=()=>{if(window.videoObserver)window.videoObserver.disconnect();window.videoObserver=new IntersectionObserver(entries=>entries.forEach(e=>{const v=e.target.querySelector('video');if(e.isIntersecting){v.play().catch(()=>{});}else v.pause()}),{root:$('#feed'),threshold:.65});$$('.video-card').forEach(c=>window.videoObserver.observe(c))};
function openPanel(id){closePanels();$('#'+id).classList.add('open')}function closePanels(){$$('.panel').forEach(x=>x.classList.remove('open'))}
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>x.classList.remove('show'),2100)}
async function share(p){const data={title:'TAKTOK',text:p.caption,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);toast('تم نسخ رابط الموقع')}}catch{}}
function openComments(p){activePost=p;const arr=store.get('comments_'+p.id,[]);$('#commentList').innerHTML=arr.map(x=>'<div class="comment-row"><b>@'+escapeHtml(x.user)+'</b><p>'+escapeHtml(x.text)+'</p></div>').join('')||'<p class="muted">كن أول من يعلق</p>';openPanel('comments')}
$('#commentForm').onsubmit=e=>{e.preventDefault();const input=$('#commentInput'),text=input.value.trim();if(!text||!activePost)return;const key='comments_'+activePost.id,arr=store.get(key,[]);arr.push({user:store.get('username','taherkld'),text});store.set(key,arr);input.value='';openComments(activePost)};
function openMore(p){activePost=p;openPanel('morePanel')}
$$('[data-close]').forEach(b=>b.onclick=closePanels);$('#navCreate').onclick=()=>$('#upload').click();$('#upload').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('video/'))return toast('اختر ملف فيديو صحيح');const url=URL.createObjectURL(f);objectUrls.push(url);posts.unshift({id:'local_'+Date.now(),user:store.get('username','taherkld'),caption:f.name,src:url,likes:0,music:'الصوت الأصلي'});store.set('posts',posts);activeTab='foryou';$$('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab==='foryou'));render();$('#feed').scrollTop=0;toast('تمت إضافة الفيديو لهذه الجلسة');e.target.value=''};
$('#navSearch').onclick=()=>openPanel('search');$('#navFriends').onclick=()=>{renderFriends('all');openPanel('friends')};$('#navInbox').onclick=()=>openPanel('inbox');$('#navProfile').onclick=()=>{refreshProfile();openPanel('profile')};$('#navHome').onclick=()=>{closePanels();$('#feed').scrollTop=0};
$('#feedTabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;activeTab=b.dataset.tab;$$('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));render()};
$('#searchInput').oninput=e=>{const q=e.target.value.trim().toLowerCase();$('#searchResults').innerHTML=q?all().filter(p=>(p.caption+' '+p.user).toLowerCase().includes(q)).map(p=>'<button class="result-row" data-result="'+p.id+'">@'+escapeHtml(p.user)+' — '+escapeHtml(p.caption)+'</button>').join(''):'<p class="muted">ابحث عن حساب أو وصف فيديو</p>'};
$('#searchResults').onclick=e=>{const b=e.target.closest('[data-result]');if(b){closePanels();activeTab='foryou';render();const c=$('[data-id="'+b.dataset.result+'"]');c?.scrollIntoView()}};$('#saveProfile').onclick=()=>{const n=$('#editName').value.trim().replace(/^@/,'');if(n){store.set('username',n);$('#username').textContent='@'+n;toast('تم حفظ الاسم على هذا الجهاز');closePanels()}};
function refreshProfile(){$('#username').textContent='@'+store.get('username','taherkld');$('#statFollowing').textContent=following.length;$('#statLikes').textContent=store.get('likes',[]).length;$('#statVideos').textContent=posts.length}
$('#editProfile').onclick=()=>{openPanel('editProfilePanel');$('#editName').value=store.get('username','taherkld')};
$('#report').onclick=()=>toast('تم تسجيل البلاغ محلياً — يلزم خادم لإرساله للإدارة');$('#block').onclick=()=>toast('الحظر الحقيقي يحتاج حساباً وخادماً');
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>{$$('.nav-btn').forEach(x=>x.classList.toggle('active',x===b))}));
render();refreshProfile();
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

$('#liveBtn').onclick=()=>toast('ميزة البث المباشر ستُفعّل بعد ربط خادم البث والحسابات');

const friendSamples=[
{id:'friend_v1',user:'sara_daily',kind:'video',caption:'يوم جميل مع الأصدقاء 🌿',src:'https://www.w3schools.com/html/mov_bbb.mp4'},
{id:'friend_p1',user:'noura.photo',kind:'photo',caption:'تفاصيل صغيرة تصنع يوماً جميلاً ☀️',src:'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1000&auto=format&fit=crop&q=85'},
{id:'friend_p2',user:'yafi.moments',kind:'photo',caption:'من أجمل اللحظات التي تستحق المشاركة',src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&auto=format&fit=crop&q=85'}
];
let friendFilter='all';
function renderFriends(filter='all'){
 friendFilter=filter;
 $$('#friends [data-friend-tab]').forEach(b=>b.classList.toggle('active',b.dataset.friendTab===filter));
 const box=$('#friendsFeed');box.innerHTML='';
 const data=[...posts.filter(p=>p.kind==='photo'||p.kind==='video').map(p=>({...p,user:p.user||'taherkld'})),...friendSamples];
 const filtered=data.filter(p=>filter==='all'||p.kind===filter);
 if(!filtered.length){box.innerHTML='<div class="empty-friends">لا توجد منشورات هنا بعد<br>عندما ينشر أصدقاؤك صوراً أو فيديوهات ستظهر هنا</div>';return}
 filtered.forEach(p=>{
  const node=document.createElement('article');node.className='friend-post';
  const media=p.kind==='video'?'<video class="friend-post-media" src="'+p.src+'" controls playsinline></video>':'<img class="friend-post-media" src="'+p.src+'" alt="منشور صديق">';
  node.innerHTML='<div class="friend-post-head"><img src="https://i.pravatar.cc/100?u='+encodeURIComponent(p.user)+'"><div><b>@'+escapeHtml(p.user)+'</b><small>منشور صديق</small></div></div>'+media+'<p class="friend-post-caption">'+escapeHtml(p.caption)+'</p><div class="friend-post-actions"><button data-faction="like">♡ إعجاب</button><button data-faction="comment">▢ تعليق</button><button data-faction="share">➤ مشاركة</button></div>';
  node.querySelector('[data-faction="like"]').onclick=e=>{e.currentTarget.classList.toggle('active');e.currentTarget.textContent=e.currentTarget.classList.contains('active')?'♥ أعجبني':'♡ إعجاب'};
  node.querySelector('[data-faction="comment"]').onclick=()=>openComments(p);
  node.querySelector('[data-faction="share"]').onclick=()=>share(p);
  box.append(node);
 });
}
$('#friends').addEventListener('click',e=>{const b=e.target.closest('[data-friend-tab]');if(b)renderFriends(b.dataset.friendTab)});
