const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");

const state = {
  page: "home",
  course: null,
  group: null,
  route: null,
  people: 2,
  bags: 1,
  ride: null
};

const pageHistory = [];

function money(value) {
  return Number(value).toLocaleString("ko-KR") + "원";
}

function pushPage(name) {
  if (state.page !== name) pageHistory.push(state.page);
  state.page = name;
  updateBackButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBackButton() {
  backBtn.classList.toggle("hidden", state.page === "home");
}

backBtn.addEventListener("click", () => {
  const previous = pageHistory.pop();
  if (!previous) return goHome();
  state.page = previous;
  renderCurrent();
});

document.getElementById("homeBtn").addEventListener("click", goHome);

function renderCurrent() {
  updateBackButton();

  switch (state.page) {
    case "course": return renderCourse();
    case "route": return renderRoute();
    case "confirm": return renderConfirm();
    case "party": return renderParty();
    case "matches": return renderMatches();
    case "checkout": return renderCheckout();
    default: return renderHome();
  }
}

function goHome() {
  state.page = "home";
  pageHistory.length = 0;
  updateBackButton();
  renderHome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="page-shell hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">TOURFORU RIDE</span>
          <h1>여행 코스만 고르세요.<br><strong>이동은 우리가 맞춰드릴게요.</strong></h1>
          <p>인원과 짐을 입력하면 여행에 맞는 차량과 가이드기사를 한 번에 추천합니다.</p>

          <div class="search-box">
            <span>⌕</span>
            <input id="courseSearch" type="search" placeholder="어디로 떠나고 싶으세요?">
            <button onclick="runCourseSearch()">검색</button>
          </div>
        </div>

        <div class="hero-feature">
          <div class="hero-feature-image">
            <img src="${TOURFORU_DATA.courses[0].hero}" alt="이순신 승전길">
            <span class="hero-feature-badge">경남 추천 코스</span>
          </div>
          <div class="hero-feature-body">
            <span>HISTORY TRAIL</span>
            <h2>이순신 승전길</h2>
            <p>승전의 바다를 따라 걷고, 이동과 가이드까지 한 번에 예약하세요.</p>
            <button onclick="selectCourse('victory-road')">지금 둘러보기 →</button>
          </div>
        </div>
      </div>
    </section>

    <section class="page-shell section">
      <div class="section-head">
        <div>
          <span class="section-kicker">추천 여행</span>
          <h2>코스를 고르면, 이동이 따라옵니다.</h2>
          <p class="section-desc">여행지를 먼저 고르고 인원과 짐만 알려주세요. 맞는 차량과 가이드기사를 찾아드립니다.</p>
        </div>
        <span class="section-count">${TOURFORU_DATA.courses.length}개 코스</span>
      </div>

      <div id="courseGrid" class="course-grid"></div>
    </section>

    <section class="how-section">
      <div class="page-shell">
        <div class="section-head">
          <div>
            <span class="section-kicker">HOW IT WORKS</span>
            <h2>복잡한 이동 예약을 간단하게</h2>
          </div>
        </div>

        <div class="steps-grid">
          <article>
            <span>01</span>
            <h3>코스 선택</h3>
            <p>원하는 관광·트래킹 코스를 선택합니다.</p>
          </article>
          <article>
            <span>02</span>
            <h3>인원 · 짐 입력</h3>
            <p>탑승 인원과 여행 짐의 수량을 입력합니다.</p>
          </article>
          <article>
            <span>03</span>
            <h3>차량 · 가이드 매칭</h3>
            <p>조건에 맞는 차량과 검증된 가이드기사를 추천합니다.</p>
          </article>
          <article>
            <span>04</span>
            <h3>예약 · 결제</h3>
            <p>선택 내용을 확인하고 안전하게 결제합니다.</p>
          </article>
        </div>
      </div>
    </section>
  `;

  renderCourseCards(TOURFORU_DATA.courses);

  const search = document.getElementById("courseSearch");
  search.addEventListener("keydown", e => {
    if (e.key === "Enter") runCourseSearch();
  });

  search.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();

    const filtered = TOURFORU_DATA.courses.filter(course =>
      `${course.title} ${course.location} ${course.category} ${course.description}`
        .toLowerCase()
        .includes(q)
    );

    renderCourseCards(filtered);
  });
}

function renderCourseCards(courses) {
  const grid = document.getElementById("courseGrid");
  if (!grid) return;

  if (!courses.length) {
    grid.innerHTML = `<div class="empty">검색 결과가 없습니다.</div>`;
    return;
  }

  grid.innerHTML = courses.map(course => `
    <article class="course-card" onclick="selectCourse('${course.id}')">
      <div class="course-image">
        <img src="${course.hero}" alt="${course.title}">
        <span class="location-badge">⌖ ${course.location}</span>
        ${course.featured ? `<span class="featured-badge">추천</span>` : ""}
      </div>
      <div class="course-body">
        <span class="category">${course.category}</span>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="card-bottom">
          <span>조회 ${course.views.toLocaleString()}</span>
          <strong>코스 보기 →</strong>
        </div>
      </div>
    </article>
  `).join("");
}

function runCourseSearch() {
  const input = document.getElementById("courseSearch");
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  const filtered = TOURFORU_DATA.courses.filter(course =>
    `${course.title} ${course.location} ${course.category} ${course.description}`
      .toLowerCase()
      .includes(q)
  );
  renderCourseCards(filtered);
  document.getElementById("courseSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!q) showToast("검색어를 입력해주세요.");
}

function selectCourse(id) {
  const course = TOURFORU_DATA.courses.find(c => c.id === id);

  if (!course?.groups) {
    showComingSoon(course.title);
    return;
  }

  state.course = course;
  pushPage("course");
  renderCourse();
}

function renderCourse() {
  const course = state.course;

  app.innerHTML = `
    <section class="detail-hero" style="background-image:linear-gradient(90deg,rgba(8,19,32,.88),rgba(8,19,32,.30)),url('${course.hero}')">
      <div class="page-shell">
        <span class="eyebrow light">${course.category}</span>
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <div class="detail-meta">
          <span>⌖ ${course.location}</span>
          <span>◉ 조회 ${course.views.toLocaleString()}</span>
        </div>
      </div>
    </section>

    <section class="page-shell section narrow">
      <div class="section-head">
        <div>
          <span class="section-kicker">여행 유형</span>
          <h2>어떤 방식으로 여행할까요?</h2>
        </div>
      </div>

      ${course.groups.map(group => `
        <article class="accordion-card">
          <button class="accordion-title" onclick="toggleGroup('${group.id}')">
            <div>
              <span class="category">TRAIL</span>
              <h3>${group.title}</h3>
              <p>${group.description}</p>
            </div>
            <span class="accordion-arrow">⌄</span>
          </button>

          <div class="route-list hidden" id="group-${group.id}">
            ${group.routes.map(route => `
              <button class="route-row" onclick="selectRoute('${group.id}','${route.id}')">
                <div>
                  <strong>${route.title}</strong>
                  <span>${route.area} · ${route.distance}km · 약 ${route.walkHours}시간</span>
                </div>
                <span>→</span>
              </button>
            `).join("")}
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function toggleGroup(id) {
  document.getElementById(`group-${id}`)?.classList.toggle("hidden");
}

function selectRoute(groupId, routeId) {
  state.group = state.course.groups.find(g => g.id === groupId);
  state.route = state.group.routes.find(r => r.id === routeId);
  pushPage("route");
  renderRoute();
}

function renderRoute() {
  const r = state.route;
  const total = TourMatching.calculateTotalHours(r);

  app.innerHTML = `
    <section class="page-shell section narrow">
      <div class="breadcrumb">${state.course.title} / ${state.group.title}</div>

      <div class="route-title">
        <span class="category">${r.area}</span>
        <h1>${r.title}</h1>
        <p>${r.description}</p>
      </div>

      <div class="metric-grid">
        <div>
          <span>총 길이</span>
          <strong>${r.distance}<small>km</small></strong>
        </div>
        <div>
          <span>트래킹</span>
          <strong>${r.walkHours}<small>시간</small></strong>
        </div>
        <div>
          <span>예상 전체 일정</span>
          <strong>${total}<small>시간</small></strong>
        </div>
        <div>
          <span>조회수</span>
          <strong>${r.views.toLocaleString()}</strong>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-head">
          <div>
            <span class="section-kicker">COURSE</span>
            <h2>주요 이동 코스</h2>
          </div>
          <span class="difficulty">${r.difficulty}</span>
        </div>

        <div class="timeline">
          ${r.stops.map((stop, i) => `
            <div class="timeline-row">
              <span>${i + 1}</span>
              <strong>${stop}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <button class="primary-btn" onclick="openConfirm()">이 코스 선택하기</button>
    </section>
  `;
}

function openConfirm() {
  pushPage("confirm");
  renderConfirm();
}

function renderConfirm() {
  const r = state.route;

  app.innerHTML = `
    <section class="page-shell section narrow">
      <div class="progress">
        <span class="on"></span><span></span><span></span><span></span>
      </div>

      <div class="form-title">
        <span class="section-kicker">STEP 1</span>
        <h1>이 코스가 맞나요?</h1>
        <p>차량을 추천하기 전에 선택한 여행코스를 한 번 더 확인해주세요.</p>
      </div>

      <div class="confirm-card">
        <span class="category">${state.course.title}</span>
        <h2>${r.title}</h2>
        <div class="confirm-row">
          <span>지역</span><strong>${r.area}</strong>
        </div>
        <div class="confirm-row">
          <span>총 길이</span><strong>${r.distance}km</strong>
        </div>
        <div class="confirm-row">
          <span>트래킹</span><strong>약 ${r.walkHours}시간</strong>
        </div>
        <div class="confirm-row">
          <span>난이도</span><strong>${r.difficulty}</strong>
        </div>
      </div>

      <button class="primary-btn" onclick="openParty()">네, 이 코스로 갈게요</button>
    </section>
  `;
}

function openParty() {
  pushPage("party");
  renderParty();
}

function renderParty() {
  app.innerHTML = `
    <section class="page-shell section narrow">
      <div class="progress">
        <span class="on"></span><span class="on"></span><span></span><span></span>
      </div>

      <div class="form-title">
        <span class="section-kicker">STEP 2</span>
        <h1>몇 분이 함께 떠나나요?</h1>
        <p>인원과 짐에 맞춰 가장 알맞은 차량을 찾아드릴게요.</p>
      </div>

      <div class="input-panel">
        <div class="counter-row">
          <div>
            <strong>탑승 인원</strong>
            <span>유아·어린이 포함 전체 인원</span>
          </div>
          <div class="counter">
            <button onclick="changeCounter('people',-1)">−</button>
            <strong id="peopleValue">${state.people}</strong>
            <button onclick="changeCounter('people',1)">＋</button>
          </div>
        </div>

        <div class="counter-row">
          <div>
            <strong>짐 수량</strong>
            <span>캐리어·대형 가방 기준</span>
          </div>
          <div class="counter">
            <button onclick="changeCounter('bags',-1)">−</button>
            <strong id="bagsValue">${state.bags}</strong>
            <button onclick="changeCounter('bags',1)">＋</button>
          </div>
        </div>
      </div>

      <div class="tip-box">
        <strong>짐이 많으신가요?</strong>
        <p>입력한 짐보다 여유 적재공간이 있는 차량을 우선 추천합니다.</p>
      </div>

      <button class="primary-btn" onclick="openMatches()">차량 · 가이드 추천받기</button>
    </section>
  `;
}

function changeCounter(type, amount) {
  const min = type === "people" ? 1 : 0;
  const max = type === "people" ? 42 : 35;

  state[type] = Math.max(min, Math.min(max, state[type] + amount));
  document.getElementById(`${type}Value`).textContent = state[type];
}

function openMatches() {
  pushPage("matches");
  renderMatches();
}

function renderMatches() {
  const matches = TourMatching.getMatches(state.people, state.bags, state.route);

  app.innerHTML = `
    <section class="page-shell section">
      <div class="progress narrow-progress">
        <span class="on"></span><span class="on"></span><span class="on"></span><span></span>
      </div>

      <div class="section-head match-heading">
        <div>
          <span class="section-kicker">STEP 3</span>
          <h1>딱 맞는 차량과<br>가이드기사를 찾았어요.</h1>
          <p>${state.people}명 · 짐 ${state.bags}개 · ${state.route.title}</p>
        </div>
        <div class="match-count">${matches.length}<small>개 추천</small></div>
      </div>

      <div class="match-grid">
        ${matches.length ? matches.map((ride, i) => rideCard(ride, i)).join("") :
          `<div class="empty">현재 조건에 맞는 차량이 없습니다.</div>`}
      </div>
    </section>
  `;
}

function rideCard(ride, index) {
  return `
    <article class="ride-card">
      <div class="ride-image">
        <img src="${ride.image}" alt="${ride.vehicle}">
        ${index === 0 ? `<span class="best-badge">BEST MATCH</span>` : ""}
        <span class="ride-type">${ride.type}</span>
      </div>

      <div class="ride-content">
        <div class="ride-title">
          <div>
            <span>${ride.year}년식</span>
            <h2>${ride.vehicle}</h2>
          </div>
          <strong>★ ${ride.guide.rating}</strong>
        </div>

        <div class="capacity-row">
          <span>♙ 최대 ${ride.capacity}명</span>
          <span>▣ 짐 ${ride.bags}개</span>
          <span>◷ 약 ${ride.totalHours}시간</span>
        </div>

        <div class="guide-box">
          <div class="avatar">${ride.guide.name.charAt(0)}</div>
          <div class="guide-main">
            <strong>${ride.guide.name} 가이드기사</strong>
            <span>${ride.guide.career} · 후기 ${ride.guide.reviews}</span>
          </div>
          <span class="verified">✓ 인증</span>
        </div>

        <details>
          <summary>기사 이력 · 차량 정비이력 보기</summary>
          <div class="history-grid">
            <div>
              <h4>가이드기사 이력</h4>
              <p>${ride.guide.guideCareer}</p>
              <p>안전 운행 ${ride.guide.safeTrips.toLocaleString()}회</p>
              <p>가능 언어 ${ride.guide.languages}</p>
            </div>
            <div>
              <h4>차량 관리</h4>
              <p>최근 정비 ${ride.maintenance.last}</p>
              <p>주행거리 ${ride.maintenance.mileage}</p>
              <p>차량 상태 ${ride.maintenance.inspection}</p>
              <p>다음 점검 ${ride.maintenance.next}</p>
            </div>
          </div>
        </details>

        <div class="price-row">
          <div>
            <span>예상 총 금액</span>
            <strong>${money(ride.calculatedPrice)}</strong>
          </div>
          <button onclick="selectRide('${ride.id}')">선택하기</button>
        </div>
      </div>
    </article>
  `;
}

function selectRide(id) {
  const matches = TourMatching.getMatches(state.people, state.bags, state.route);
  state.ride = matches.find(r => r.id === id);

  pushPage("checkout");
  renderCheckout();
}

function renderCheckout() {
  const r = state.route;
  const ride = state.ride;

  app.innerHTML = `
    <section class="page-shell section checkout-layout">
      <div class="checkout-main">
        <div class="progress">
          <span class="on"></span><span class="on"></span><span class="on"></span><span class="on"></span>
        </div>

        <div class="form-title">
          <span class="section-kicker">STEP 4</span>
          <h1>예약 내용을 확인해주세요.</h1>
          <p>결제 후 가이드기사 안심번호가 제공됩니다.</p>
        </div>

        <div class="summary-card">
          <h3>여행 코스</h3>
          <div class="summary-line">
            <span>코스</span>
            <strong>${r.title}</strong>
          </div>
          <div class="summary-line">
            <span>지역</span>
            <strong>${r.area}</strong>
          </div>
          <div class="summary-line">
            <span>예상 일정</span>
            <strong>약 ${ride.totalHours}시간</strong>
          </div>
        </div>

        <div class="summary-card">
          <h3>탑승 정보</h3>
          <div class="summary-line">
            <span>인원</span>
            <strong>${state.people}명</strong>
          </div>
          <div class="summary-line">
            <span>짐</span>
            <strong>${state.bags}개</strong>
          </div>
        </div>

        <div class="summary-card">
          <h3>차량 · 가이드기사</h3>
          <div class="selected-ride">
            <img src="${ride.image}" alt="${ride.vehicle}">
            <div>
              <strong>${ride.vehicle}</strong>
              <span>${ride.guide.name} 가이드기사 · ★ ${ride.guide.rating}</span>
            </div>
          </div>
        </div>
      </div>

      <aside class="payment-summary">
        <span>최종 결제금액</span>
        <strong>${money(ride.calculatedPrice)}</strong>

        <div class="payment-note">
          <p>✓ 차량 및 가이드기사 포함</p>
          <p>✓ 선택 코스 예상 운행시간 반영</p>
          <p>✓ 결제 완료 후 안심번호 제공</p>
        </div>

        <button class="toss-btn" onclick="payNow()">토스페이로 결제하기</button>
        <small>현재 개발 단계에서는 테스트 결제로 진행합니다.</small>
      </aside>
    </section>
  `;
}

function payNow() {
  const reservation = {
    orderId: "TFR-" + Date.now(),
    course: state.route.title,
    people: state.people,
    bags: state.bags,
    vehicle: state.ride.vehicle,
    guide: state.ride.guide.name,
    amount: state.ride.calculatedPrice
  };

  TourPayment.start(reservation);
}

function showPaymentDemo(reservation) {
  app.innerHTML = `
    <section class="page-shell section narrow">
      <div class="success-icon">✓</div>
      <div class="success-title">
        <span class="section-kicker">TEST PAYMENT</span>
        <h1>테스트 결제 단계입니다.</h1>
        <p>다음 개발 단계에서 토스페이먼츠 테스트 API를 연결합니다.</p>
      </div>

      <div class="confirm-card">
        <div class="confirm-row">
          <span>주문번호</span><strong>${reservation.orderId}</strong>
        </div>
        <div class="confirm-row">
          <span>코스</span><strong>${reservation.course}</strong>
        </div>
        <div class="confirm-row">
          <span>차량</span><strong>${reservation.vehicle}</strong>
        </div>
        <div class="confirm-row">
          <span>가이드기사</span><strong>${reservation.guide}</strong>
        </div>
        <div class="confirm-row total">
          <span>결제금액</span><strong>${money(reservation.amount)}</strong>
        </div>
      </div>

      <div class="safe-number">
        <span>결제 완료 후 표시</span>
        <strong>0504-***-****</strong>
        <p>가이드기사 안심번호</p>
      </div>

      <button class="primary-btn" onclick="goHome()">홈으로 돌아가기</button>
    </section>
  `;

  state.page = "payment-demo";
  updateBackButton();
}

function showComingSoon(name) {
  showToast(`${name} 기능은 다음 버전에서 연결합니다.`);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

renderHome();
