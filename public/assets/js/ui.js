// ===== DATA =====
const CATS = {
  Vialidad: "🛣️",
  "Agua y Drenaje": "💧",
  Alumbrado: "💡",
  Residuos: "🗑️",
  Seguridad: "🚨",
  Otro: "📋",
};
const EMOJIS = Object.values(CATS);

let reports = [
  {
    id: 1,
    title: "Bache enorme frente a la escuela Normal Superior",
    desc: "Hay un bache de casi 80cm de diámetro frente a la escuela. Ya causó una caída de una bicicleta. Los niños tienen que cruzar la calle para evitarlo. Llevamos 2 meses esperando reparación.",
    location: "Barrio Chile, Calle 42 #23, San Juan Nepomuceno",
    category: "Vialidad",
    severity: "high",
    status: "review",
    name: "María González",
    date: "20 Abr 2026",
    votes: 15,
    userVoted: false,
    img: null,
    lat: 9.961742,
    lng: -75.08057
  },
  {
    id: 2,
    title: "Cortes de Luz frecuentes",
    desc: "Desde hace dos semana en el municipio se han presentado varaios apagones y bajas en el voltaje en los hogares. Esto ha provocado dachos a muchos electrodomésticos, lo que ha generado descontento en la comunidad .",
    location: "Calle 28 #40, Pueblo Nuevo, El Carmen de Bolivar",
    category: "Servicio Eléctrico",
    severity: "high",
    status: "pending",
    name: "Daniela Paez",
    date: "19 Abr 2026",
    votes: 21,
    userVoted: false,
    img: null,
    lat: 9.9617420,
    lng:-75.0805686
  },
  {
    id: 3,
    title: "Sin iluminación en toda la cuadra",
    desc: "Cinco postes de luz llevan 3 semanas sin funcionar. El área queda completamente oscura y se han reportado 2 robos en ese tramo.",
    location: "Calle Lomba, #40-25, Arjona, Bolívar",
    category: "Alumbrado",
    severity: "low",
    status: "pending",
    name: "Yohan Alvarez",
    date: "18 Abr 2026",
    votes: 18,
    userVoted: false,
    img: null,
  },
  {
    id: 4,
    title: "Puente en deterioro",
    desc: "El puente que conecta a dos comunidades está en pésimas condiciones, a punto de caerse. Se pide respuestas por parte de las autoridades.",
    location: "Barrio la Isla, Cr. 8, Calle 2 #34p",
    category: "Mal estado de obra",
    severity: "high",
    status: "pending",
    name: "Keila Buelvas",
    date: "17 Abr 2026",
    votes: 9,
    userVoted: false,
    img: null,
    lat: 10.047382,
    lng: -75.026710
  },
  {
    id: 5,
    title: "Calles llenas de lodo",
    desc: "Cada vez que llueve, el drenaje se desborda e inunda 3 casas. Ya reportamos con la presidencia hace un mes sin respuesta.",
    location: "Calle Alfonso Lopez",
    category: "Agua y Drenaje",
    severity: "medium",
    status: "review",
    name: "Ana Martínez",
    date: "16 Abr 2026",
    votes: 5,
    userVoted: false,
    img: null,
  },
  {
    id: 6,
    title: "Parque en abandono total sin mantenimiento",
    desc: "El parque municipal lleva 6 meses sin mantenimiento. Los juegos infantiles están rotos y peligrosos.",
    location: "Parque Municipal, Centro Histórico",
    category: "Otro",
    severity: "low",
    status: "resolved",
    name: "Ciudadano anónimo",
    date: "15 Abr 2026",
    votes: 12,
    userVoted: false,
    img: null,
  },
];

let selectedFiles = [];
let activeFilter = "all";
let currentCat = "all";

// ===== RENDER FEED =====
function renderFeed(list) {
  const grid = document.getElementById("feed-grid");
  if (!list.length) {
    grid.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:#aaa;padding:40px;font-family:Space Mono,monospace;font-size:12px;">NO SE ENCONTRARON DENUNCIAS</p>';
    return;
  }
  grid.innerHTML = list
    .map(
      (r, i) => `
      <div class="report-card" onclick="openModal(${r.id})" style="animation-delay:${i * 0.07}s">
        <div class="card-media">
          ${r.img ? `<img src="${r.img}" alt="">` : `<div class="no-media">${CATS[r.category] || "📋"}</div>`}
          <span class="card-badge badge-${r.severity}">${r.severity === "high" ? "🔴 Urgente" : r.severity === "medium" ? "🟡 Media" : "🟢 Baja"}</span>
          <span class="card-status-dot status-${r.status}"></span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="card-cat">${CATS[r.category] || "📋"} ${r.category}</span>
            <span class="card-dot"></span>
            <span class="card-date">${r.date}</span>
          </div>
          <div class="card-title">${r.title}</div>
          <div class="card-desc">${r.desc}</div>
          <div class="card-footer">
            <span class="card-location">📍 ${r.location.split(",").slice(-2).join(",").trim()}</span>
            <div class="card-votes">
              <button class="vote-btn ${r.userVoted ? "voted" : ""}" onclick="vote(event,${r.id})">
                👍 ${r.votes}
              </button>
            </div>
          </div>
        </div>
      </div>
    `,
    )
    .join("");
}

function getFiltered() {
  let list = [...reports];
  if (currentCat !== "all")
    list = list.filter((r) => r.category === currentCat);
  if (
    activeFilter === "high" ||
    activeFilter === "medium" ||
    activeFilter === "low"
  )
    list = list.filter((r) => r.severity === activeFilter);
  else if (activeFilter === "pending")
    list = list.filter((r) => r.status === "pending");
  else if (activeFilter === "resolved")
    list = list.filter((r) => r.status === "resolved");
  const q = document.getElementById("search-input")?.value.toLowerCase() || "";
  if (q)
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  return list;
}

function filterFeed(btn, f) {
  activeFilter = f;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderFeed(getFiltered());
}

function filterByCategory(cat) {
  currentCat = cat;
  showSection("feed");
  setTimeout(() => renderFeed(getFiltered()), 50);
}

function searchReports() {
  renderFeed(getFiltered());
}

// ===== VOTE =====
function vote(e, id) {
  e.stopPropagation();
  const r = reports.find((x) => x.id === id);
  if (!r) return;
  r.userVoted = !r.userVoted;
  r.votes += r.userVoted ? 1 : -1;
  renderFeed(getFiltered());
}

// ===== MODAL =====
function openModal(id) {
  const r = reports.find((x) => x.id === id);
  if (!r) return;
  document.getElementById("modal-title").textContent = r.title;
  document.getElementById("modal-media").innerHTML = r.img
    ? `<img src="${r.img}" alt="" style="width:100%;height:100%;object-fit:cover">`
    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px;background:var(--light)">${CATS[r.category] || "📋"}</div>`;
  document.getElementById("modal-meta").innerHTML = `
      <div class="modal-meta-item"><span>Categoría</span><span>${CATS[r.category]} ${r.category}</span></div>
      <div class="modal-meta-item"><span>Urgencia</span><span>${r.severity === "high" ? "🔴 Urgente" : r.severity === "medium" ? "🟡 Media" : "🟢 Baja"}</span></div>
      <div class="modal-meta-item"><span>Reportado por</span><span>${r.name}</span></div>
      <div class="modal-meta-item"><span>Fecha</span><span>${r.date}</span></div>
      <div class="modal-meta-item"><span>Ubicación</span><span>${r.location}</span></div>
      <div class="modal-meta-item"><span>Votos</span><span>👍 ${r.votes}</span></div>
    `;
  document.getElementById("modal-desc").textContent = r.desc;
  ["tl-review", "tl-escalated", "tl-resolved"].forEach((id) => {
    document.getElementById(id).querySelector(".tl-dot").className =
      "tl-dot tl-pending";
  });
  if (r.status === "review" || r.status === "resolved") {
    document.getElementById("tl-review").querySelector(".tl-dot").className =
      "tl-dot tl-done";
  }
  if (r.status === "resolved") {
    document.getElementById("tl-escalated").querySelector(".tl-dot").className =
      "tl-dot tl-done";
    document.getElementById("tl-resolved").querySelector(".tl-dot").className =
      "tl-dot tl-done";
  }
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (
    !e ||
    e.target === document.getElementById("modal-overlay") ||
    e.currentTarget.tagName === "BUTTON"
  ) {
    document.getElementById("modal-overlay").classList.remove("open");
    document.body.style.overflow = "";
  }
}

// ===== FORM =====
function selectCat(el, cat) {
  document
    .querySelectorAll(".cat-option")
    .forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("selected-cat").value = cat;
}

function selectSev(el, sev) {
  document
    .querySelectorAll(".sev-btn")
    .forEach((x) => (x.className = "sev-btn"));
  el.classList.add(`sel-${sev}`);
  document.getElementById("selected-sev").value = sev;
}

function handleFiles(files) {
  const preview = document.getElementById("media-preview");
  Array.from(files).forEach((file) => {
    const idx = selectedFiles.length;
    selectedFiles.push(file);
    const item = document.createElement("div");
    item.className = "preview-item";
    item.dataset.idx = idx;
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      item.appendChild(img);
    } else {
      const ov = document.createElement("div");
      ov.className = "video-overlay";
      ov.textContent = "🎬";
      item.style.background = "#1a1a1a";
      item.appendChild(ov);
    }
    const rm = document.createElement("button");
    rm.className = "remove-btn";
    rm.textContent = "✕";
    rm.onclick = (e) => {
      e.stopPropagation();
      selectedFiles.splice(idx, 1);
      item.remove();
    };
    item.appendChild(rm);
    preview.appendChild(item);
  });
}

// Drag & drop
const dz = document.getElementById("drop-zone");
if (dz) {
  dz.addEventListener("dragover", (e) => {
    e.preventDefault();
    dz.classList.add("drag-over");
  });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag-over"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });
}

function submitReport() {
  const title = document.getElementById("report-title").value.trim();
  const desc = document.getElementById("report-desc").value.trim();
  const location = document.getElementById("report-location").value.trim();
  if (!title || !desc || !location) {
    alert(
      "Por favor completa los campos obligatorios: título, descripción y ubicación.",
    );
    return;
  }
  const isAnon = document.getElementById("anon-check").checked;
  const name = isAnon
    ? "Ciudadano anónimo"
    : document.getElementById("report-name").value.trim() ||
      "Ciudadano anónimo";
  const newReport = {
    id: reports.length + 1,
    title,
    desc,
    location,
    category: document.getElementById("selected-cat").value,
    severity: document.getElementById("selected-sev").value,
    status: "pending",
    name,
    date: new Date().toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    votes: 0,
    userVoted: false,
    img: null,
  };
  // Read first image if any
  if (selectedFiles.length > 0 && selectedFiles[0].type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newReport.img = e.target.result;
    };
    reader.readAsDataURL(selectedFiles[0]);
  }
  reports.unshift(newReport);
  document.getElementById("stat-total").textContent = reports.length + 247;
  document.getElementById("success-banner").classList.add("show");
  // Reset
  setTimeout(() => {
    document.getElementById("report-title").value = "";
    document.getElementById("report-desc").value = "";
    document.getElementById("report-location").value = "";
    document.getElementById("report-name").value = "";
    document.getElementById("report-email").value = "";
    document.getElementById("media-preview").innerHTML = "";
    document.getElementById("anon-check").checked = false;
    selectedFiles = [];
    document.getElementById("success-banner").classList.remove("show");
    showSection("feed");
  }, 2500);
}

// ===== NAVIGATION =====
const sections = {
  feed: "feed-section",
  form: "form-section",
  map: "map-section",
  how: "how-section",
};
function showSection(key) {
  Object.values(sections).forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  document.getElementById(sections[key]).style.display = "block";
  document.querySelectorAll("nav a").forEach((a, i) => {
    a.classList.toggle("active", ["feed", "form", "map", "how"][i] === key);
  });
  window.scrollTo({
    top: document.querySelector("header").offsetHeight,
    behavior: "smooth",
  });
  if (key === "feed") renderFeed(getFiltered());
  if (key === "map") renderMapDots();
}

// MAP DOTS

function renderMapDots() {
  reports.forEach(r => {

    let color;

    if (r.gravedad === "alta") color = "red";
    else if (r.gravedad === "media") color = "orange";
    else color = "green";

    var marker = L.circleMarker([r.lat, r.lng], {
      color: color,
      radius: 8
    }).addTo(map);

    marker.bindPopup(`
      <b>${r.tipo}</b><br>
      Gravedad: ${r.gravedad}
    `);
  });
}

// INIT
renderFeed(getFiltered());
