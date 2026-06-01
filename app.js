const products = [
  {
    id: "cu-pbick-morning",
    store: "CU",
    name: "PBICK 더 키친 아침 간편식",
    category: "간편식",
    price: 3900,
    distance: 0.4,
    tags: ["신상품", "오프라인", "픽업"],
    exclusive: true,
    online: true,
    offline: true,
    source: "CU 공식 상품 페이지/포켓CU 확인 대상",
    desc: "CU의 PBICK 라인 확장 상품으로, 가까운 점포 재고조회 후 픽업 또는 배달 확인이 필요한 품목입니다.",
    channels: ["포켓CU 재고조회", "CU 매장", "포켓CU 픽업/배달"]
  },
  {
    id: "gs-focaccia",
    store: "GS25",
    name: "고단백저당 포카치아 토마토치즈",
    category: "베이커리",
    price: 2500,
    distance: 0.7,
    tags: ["행사", "신상품", "오프라인"],
    exclusive: false,
    online: false,
    offline: true,
    source: "GS25 공식 행사상품 페이지 확인 대상",
    desc: "GS25 행사상품 영역에 노출된 상품입니다. 점포별 행사 제외 가능성이 있어 앱/매장 재확인이 필요합니다.",
    channels: ["GS25 매장", "우리동네GS 확인"]
  },
  {
    id: "seven-bread",
    store: "7-Eleven",
    name: "세븐셀렉트 숨결통식빵",
    category: "베이커리",
    price: 4800,
    distance: 1.1,
    tags: ["독점", "오프라인"],
    exclusive: true,
    online: false,
    offline: true,
    source: "세븐일레븐/롯데 유통 보도 확인 대상",
    desc: "세븐셀렉트 PB 상품으로 확인된 품목입니다. 가까운 점포 전화 또는 세븐앱 재고 확인을 권장합니다.",
    channels: ["세븐일레븐 매장", "세븐앱 확인"]
  },
  {
    id: "emart-chef-kick",
    store: "emart24",
    name: "셰프의 킥 퓨전 한식 3종",
    category: "도시락/면",
    price: 5200,
    distance: 1.6,
    tags: ["협업", "신상품", "오프라인"],
    exclusive: true,
    online: false,
    offline: true,
    source: "이마트24 신상품/보도 확인 대상",
    desc: "셰프 협업 간편식 라인입니다. 입고 점포 편차가 커서 이마트24 앱과 매장 확인이 필요합니다.",
    channels: ["이마트24 매장", "이마트24 앱 확인"]
  },
  {
    id: "gs-yogurt-popcorn",
    store: "GS25",
    name: "요아정 요거트초코쉘팝 팝콘",
    category: "스낵",
    price: 3000,
    distance: 0.9,
    tags: ["행사", "온라인", "오프라인"],
    exclusive: false,
    online: true,
    offline: true,
    source: "GS25 공식 행사상품 페이지 확인 대상",
    desc: "행사상품으로 포착된 스낵류입니다. 배달/픽업 가능 여부는 우리동네GS에서 점포별로 확인합니다.",
    channels: ["GS25 매장", "우리동네GS 배달/픽업"]
  },
  {
    id: "cu-global-snack",
    store: "CU",
    name: "해외 이슈 초콜릿/스낵 라인",
    category: "디저트",
    price: 3500,
    distance: 0.6,
    tags: ["독점", "온라인", "예약"],
    exclusive: true,
    online: true,
    offline: false,
    source: "포켓CU 한정 판매/예약구매 확인 대상",
    desc: "CU가 포켓CU 전용 또는 한정 수량으로 운영하는 유형의 상품입니다. 오픈 시간과 수량 알림이 중요합니다.",
    channels: ["포켓CU 예약구매", "포켓CU 온라인 주문"]
  }
];

const channels = [
  { name: "포켓CU", copy: "CU 재고조회, 픽업, 배달, 예약구매 확인" },
  { name: "우리동네GS", copy: "GS25 재고찾기, 배달/픽업, 행사상품 확인" },
  { name: "세븐앱", copy: "세븐일레븐 상품/행사, 일부 재고 확인" },
  { name: "이마트24 앱", copy: "이마트24 점포/상품/행사 확인" }
];

const state = {
  filter: "all",
  store: "all",
  query: "",
  region: "서울 강남구",
  sort: "fresh"
};

const productList = document.querySelector("#productList");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const statusCard = document.querySelector(".status-card");
const syncTitle = document.querySelector("#syncTitle");
const syncCopy = document.querySelector("#syncCopy");
const syncTime = document.querySelector("#syncTime");
const channelGrid = document.querySelector("#channelGrid");
const installButton = document.querySelector("#installButton");
let deferredInstallPrompt = null;

function won(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function brandClass(store) {
  return {
    CU: "brand-cu",
    GS25: "brand-gs",
    "7-Eleven": "brand-seven",
    emart24: "brand-emart"
  }[store];
}

function matchesFilter(product) {
  if (state.filter === "exclusive") return product.exclusive;
  if (state.filter === "new") return product.tags.includes("신상품");
  if (state.filter === "online") return product.online;
  if (state.filter === "offline") return product.offline;
  return true;
}

function getFilteredProducts() {
  const query = state.query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const storeMatch = state.store === "all" || product.store === state.store;
    const queryMatch = !query || [product.name, product.store, product.category, product.desc].join(" ").toLowerCase().includes(query);
    return storeMatch && queryMatch && matchesFilter(product);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "distance") return a.distance - b.distance;
    if (state.sort === "price") return a.price - b.price;
    return products.indexOf(a) - products.indexOf(b);
  });
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();
  resultCount.textContent = `${visibleProducts.length}개 상품`;

  if (!visibleProducts.length) {
    productList.innerHTML = '<div class="empty-state">조건에 맞는 상품이 없습니다.</div>';
    return;
  }

  productList.innerHTML = visibleProducts
    .map((product) => {
      const badges = [
        product.exclusive ? '<span class="badge exclusive">독점</span>' : "",
        product.online ? '<span class="badge online">온라인 가능</span>' : "",
        product.offline ? '<span class="badge">매장 구매</span>' : "",
        ...product.tags.map((tag) => `<span class="badge">${tag}</span>`)
      ].join("");

      return `
        <article class="product-card">
          <div class="product-art ${brandClass(product.store)}">${product.store}<br>${product.category}</div>
          <div class="product-main">
            <div class="product-meta">
              <span>${product.store}</span>
              <span>${state.region} 기준 ${product.distance.toFixed(1)}km</span>
            </div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.desc}</p>
            <div class="badges">${badges}</div>
            <div class="buy-row">
              <span class="price">${won(product.price)}</span>
              <button class="buy-button" data-product="${product.id}">구매처 보기</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderChannels() {
  channelGrid.innerHTML = channels
    .map(
      (channel) => `
        <div class="channel-card">
          <strong>${channel.name}</strong>
          <span>${channel.copy}</span>
        </div>
      `
    )
    .join("");
}

function setActiveButton(selector, value, attribute) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("active", button.dataset[attribute] === value);
  });
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    setActiveButton(".tab", state.filter, "filter");
    renderProducts();
  });
});

document.querySelectorAll(".store-chip").forEach((button) => {
  button.addEventListener("click", () => {
    state.store = button.dataset.store;
    setActiveButton(".store-chip", state.store, "store");
    renderProducts();
  });
});

document.querySelectorAll(".location-pill").forEach((button) => {
  button.addEventListener("click", () => {
    state.region = button.dataset.region;
    setActiveButton(".location-pill", state.region, "region");
    renderProducts();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.querySelector("#refreshButton").addEventListener("click", () => {
  const now = new Date();
  statusCard.classList.add("synced");
  syncTitle.textContent = "오늘 업데이트 확인 완료";
  syncCopy.textContent = "신상품, 독점 여부, 온라인/오프라인 구매 채널을 다시 계산했습니다.";
  syncTime.textContent = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.product);
  const channelText = product.channels.join(" · ");
  syncTitle.textContent = `${product.name} 구매처`;
  syncCopy.textContent = channelText;
  statusCard.classList.add("synced");
});

renderChannels();
renderProducts();
