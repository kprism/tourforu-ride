const root=document.getElementById("adminApp");
let courses=TourStore.getCourses(),selectedId=courses[0]?.id||null,modalState=null;
const uid=p=>p+"-"+Date.now().toString(36);
const safe=(v="")=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const field=(id,label,value="",type="text")=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" value="${safe(value)}"></div>`;
const area=(id,label,value="")=>`<div class="field full"><label for="${id}">${label}</label><textarea id="${id}">${safe(value)}</textarea></div>`;
const current=()=>courses.find(c=>c.id===selectedId);
const persist=()=>TourStore.saveCourses(courses);
const num=id=>Number(document.getElementById(id)?.value||0);
const text=id=>document.getElementById(id)?.value.trim()||"";
const checked=id=>!!document.getElementById(id)?.checked;

function render(){
 const c=current();
 root.innerHTML=`<div class="layout">
 <aside class="side"><div class="logo">TOURFORU <b>RIDE</b><small>ADMIN</small></div><nav><button class="on">관광상품 관리</button><button onclick="soon('차량 관리')">차량 관리</button><button onclick="soon('가이드기사 관리')">가이드기사 관리</button><button onclick="soon('예약 관리')">예약 관리</button><button onclick="soon('결제 관리')">결제 관리</button><button onclick="soon('사이트 설정')">사이트 설정</button></nav><a class="site" href="../" target="_blank">홈페이지 보기 ↗</a></aside>
 <main class="main"><div class="head"><div><small>CONTENT MANAGEMENT</small><h1>관광상품 관리</h1><p>상품, 하위 여행유형, 세부코스를 한 화면에서 관리합니다.</p></div><button class="btn primary" onclick="newCourse()">＋ 관광상품 추가</button></div>
 <div class="notice">저장하면 홈페이지가 같은 공통 데이터 저장소를 읽습니다. 현재는 브라우저 저장 방식이며, 다음 서버 단계에서 중앙 DB로 교체합니다.</div>
 <div class="grid"><section class="panel"><div class="panel-head"><h3>관광상품</h3><span>${courses.length}개</span></div><div class="list">${courses.map((x,i)=>`<div class="item ${x.id===selectedId?"on":""}" onclick="pick('${x.id}')"><div><strong>${safe(x.title)}</strong><span>${safe(x.location||"지역 미설정")} · 하위유형 ${x.groups?.length||0}개</span></div><div class="order"><button title="위로" onclick="event.stopPropagation();moveCourse(${i},-1)">↑</button><button title="아래로" onclick="event.stopPropagation();moveCourse(${i},1)">↓</button></div></div>`).join("")||"<p>등록된 상품이 없습니다.</p>"}</div></section>
 <section class="panel">${c?courseEditor(c):"<div class='empty-admin'>관광상품을 추가해주세요.</div>"}</section></div></main></div>
 <div id="modalRoot"></div>`;
}

function courseEditor(c){return `
 <div class="editor-title"><div><span class="kicker">TOUR PRODUCT</span><h2>${safe(c.title)}</h2></div><span class="status ${c.published===false?"off":"on"}">${c.published===false?"비공개":"공개"}</span></div>
 <div class="fields">${field("title","상품명",c.title)}${field("location","지역",c.location)}${field("category","카테고리",c.category)}${field("hero","대표 이미지 URL/경로",c.hero)}${field("views","조회수",c.views||0,"number")}${field("sortOrder","노출순서",c.sortOrder||0,"number")}${area("description","상품 설명",c.description)}
 <div class="field full checks"><label><input id="featured" type="checkbox" ${c.featured?"checked":""}> 홈페이지 추천상품</label><label><input id="published" type="checkbox" ${c.published===false?"":"checked"}> 홈페이지 공개</label></div></div>
 <div class="row actions"><button class="btn primary" onclick="saveCourse()">저장</button><button class="btn" onclick="previewCourse()">홈페이지에서 보기</button><button class="btn danger" onclick="removeCourse()">삭제</button></div>
 <div class="section"><div class="section-head"><div><span class="kicker">CHILD COURSES</span><h3>하위 여행유형</h3></div><button class="btn" onclick="openGroupForm()">＋ 여행유형 추가</button></div>
 ${(c.groups||[]).map((g,i)=>groupCard(g,i)).join("")||"<div class='empty-admin small'>하위 여행유형이 없습니다.</div>"}</div>`}

function groupCard(g,i){return `<div class="group"><div class="group-title"><div><div class="group-label">여행유형 ${i+1}</div><strong>${safe(g.title)}</strong><p>${safe(g.description||"설명 없음")}</p></div><div class="row"><button class="mini" onclick="moveGroup(${i},-1)">↑</button><button class="mini" onclick="moveGroup(${i},1)">↓</button><button class="btn" onclick="openGroupForm('${g.id}')">수정</button><button class="btn" onclick="openRouteForm('${g.id}')">＋ 세부코스</button><button class="btn danger" onclick="removeGroup('${g.id}')">삭제</button></div></div>
 <div class="route-list-admin">${(g.routes||[]).map((r,ri)=>routeRow(g,r,ri)).join("")||"<div class='empty-admin small'>세부코스가 없습니다.</div>"}</div></div>`}

function routeRow(g,r,i){return `<div class="route"><div><strong>${safe(r.title)}</strong><span>${safe(r.area||"-")} · ${r.distance||0}km · 약 ${r.walkHours||0}시간 · 지점 ${r.stops?.length||0}개</span></div><div class="row"><button class="mini" onclick="moveRoute('${g.id}',${i},-1)">↑</button><button class="mini" onclick="moveRoute('${g.id}',${i},1)">↓</button><button class="btn" onclick="openRouteForm('${g.id}','${r.id}')">수정</button><button class="btn danger" onclick="removeRoute('${g.id}','${r.id}')">삭제</button></div></div>`}

function modal(title,body,saveAction){document.getElementById("modalRoot").innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal"><div class="modal-head"><div><span class="kicker">EDITOR</span><h2>${title}</h2></div><button class="close" onclick="closeModal()">×</button></div><div class="modal-body">${body}</div><div class="modal-actions"><button class="btn" onclick="closeModal()">취소</button><button class="btn primary" onclick="${saveAction}">저장</button></div></div></div>`}
function closeModal(){document.getElementById("modalRoot").innerHTML="";modalState=null}

function newCourse(){const c={id:uid("course"),title:"새 관광상품",location:"",category:"",description:"",hero:"",featured:false,published:false,views:0,sortOrder:courses.length+1,groups:[]};courses.push(c);selectedId=c.id;persist();render()}
function pick(id){selectedId=id;render()}
function saveCourse(){const c=current();Object.assign(c,{title:text("title"),location:text("location"),category:text("category"),hero:text("hero"),description:text("description"),views:num("views"),sortOrder:num("sortOrder"),featured:checked("featured"),published:checked("published")});persist();render();toast("관광상품을 저장했습니다.")}
function removeCourse(){if(!confirm("이 상품과 모든 하위코스를 삭제할까요?"))return;courses=courses.filter(c=>c.id!==selectedId);selectedId=courses[0]?.id||null;persist();render()}
function previewCourse(){window.open("../","_blank")}

function openGroupForm(id=null){const c=current(),g=id?c.groups.find(x=>x.id===id):{title:"",description:"",published:true};modalState={type:"group",id};modal(id?"여행유형 수정":"여행유형 추가",`${field("mGroupTitle","여행유형명",g.title)}${area("mGroupDescription","설명",g.description)}<div class="field full checks"><label><input id="mGroupPublished" type="checkbox" ${g.published===false?"":"checked"}> 홈페이지 공개</label></div>`,"saveGroup()")}
function saveGroup(){const c=current();let g=modalState.id?c.groups.find(x=>x.id===modalState.id):null;if(!text("mGroupTitle"))return alert("여행유형명을 입력해주세요.");if(!g){g={id:uid("group"),routes:[]};(c.groups??=[]).push(g)}Object.assign(g,{title:text("mGroupTitle"),description:text("mGroupDescription"),published:checked("mGroupPublished")});persist();closeModal();render()}
function removeGroup(id){if(!confirm("여행유형과 그 안의 세부코스를 삭제할까요?"))return;current().groups=current().groups.filter(g=>g.id!==id);persist();render()}

function openRouteForm(gid,rid=null){const g=current().groups.find(x=>x.id===gid),r=rid?g.routes.find(x=>x.id===rid):{title:"",area:"",distance:0,walkHours:0,transportHours:0,difficulty:"보통",description:"",stops:[],published:true};modalState={type:"route",gid,rid};modal(rid?"세부코스 수정":"세부코스 추가",`<div class="fields">${field("mRouteTitle","세부코스명",r.title)}${field("mRouteArea","지역",r.area)}${field("mRouteDistance","거리(km)",r.distance,"number")}${field("mRouteWalk","트래킹 시간",r.walkHours,"number")}${field("mRouteTransport","차량 이동시간",r.transportHours,"number")}${field("mRouteDifficulty","난이도",r.difficulty)}${area("mRouteDescription","코스 설명",r.description)}${area("mRouteStops","주요 지점 (한 줄에 하나)",(r.stops||[]).join("\n"))}<div class="field full checks"><label><input id="mRoutePublished" type="checkbox" ${r.published===false?"":"checked"}> 홈페이지 공개</label></div></div>`,"saveRoute()")}
function saveRoute(){const {gid,rid}=modalState,g=current().groups.find(x=>x.id===gid);if(!text("mRouteTitle"))return alert("세부코스명을 입력해주세요.");let r=rid?g.routes.find(x=>x.id===rid):null;if(!r){r={id:uid("route"),views:0};(g.routes??=[]).push(r)}Object.assign(r,{title:text("mRouteTitle"),area:text("mRouteArea"),distance:num("mRouteDistance"),walkHours:num("mRouteWalk"),transportHours:num("mRouteTransport"),difficulty:text("mRouteDifficulty")||"보통",description:text("mRouteDescription"),stops:document.getElementById("mRouteStops").value.split("\n").map(x=>x.trim()).filter(Boolean),published:checked("mRoutePublished")});persist();closeModal();render()}
function removeRoute(gid,rid){if(!confirm("세부코스를 삭제할까요?"))return;const g=current().groups.find(x=>x.id===gid);g.routes=g.routes.filter(r=>r.id!==rid);persist();render()}

function move(arr,i,d){const n=i+d;if(n<0||n>=arr.length)return;[arr[i],arr[n]]=[arr[n],arr[i]];persist();render()}
function moveCourse(i,d){move(courses,i,d)}function moveGroup(i,d){move(current().groups,i,d)}function moveRoute(gid,i,d){move(current().groups.find(g=>g.id===gid).routes,i,d)}
function toast(msg){const el=document.createElement("div");el.className="admin-toast";el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),1800)}
function soon(name){alert(name+"는 다음 관리모듈에서 연결합니다.")}
render();