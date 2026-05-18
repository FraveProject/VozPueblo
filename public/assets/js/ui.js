const CATS = {
  Vialidad: "🛣️",
  "Agua y Drenaje": "💧",
  Alumbrado: "💡",
  Residuos: "🗑️",
  Seguridad: "🚨",
  Otro: "📋",
};

let selectedFiles = [];
let activeFilter = "all";
let currentCat = "all";
window._denuncias = [];

function normalizarDenuncia(d) {
  const sevMap = { alta: 'high', media: 'medium', baja: 'low' };
  const statusMap = { pendiente: 'pending', revision: 'review', resuelto: 'resolved' };
  return {
    id: d._id,
    title: d.titulo,
    desc: d.descripcion,
    location: d.ubicacion,
    category: d.categoria,
    severity: sevMap[d.gravedad] || 'medium',
    status: statusMap[d.estado] || 'pending',
    name: d.nombre,
    date: new Date(d.createdAt).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    votes: d.votos,
    img: d.img,
    lat: d.lat,
    lng: d.lng,
  };
}
window.normalizarDenuncia = normalizarDenuncia;

function renderFeed(list) {
  const grid = document.getElementById("feed-grid");
  if (!list.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;padding:40px;font-family:Space Mono,monospace;font-size:12px;">NO SE ENCONTRARON DENUNCIAS</p>';
    return;
  }
  grid.innerHTML = list.map((r, i) => `
    <div class="report-card" onclick="openModal('${r.id}')" style="animation-delay:${i * 0.07}s">
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
          <span class="card-location">📍 ${r.location}</span>
          <div class="card-votes">
            <button class="vote-btn ${r.userVoted ? "voted" : ""}" onclick="vote(event,'${r.id}')">
              👍 ${r.votes}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}
window.renderFeed = renderFeed;

function getFiltered() {
  let list = [...window._denuncias];
  if (currentCat !== "all")
    list = list.filter((r) => r.category === currentCat);
  if (activeFilter === "high" || activeFilter === "medium" || activeFilter === "low")
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
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderFeed(getFiltered());
}
window.filterFeed = filterFeed;

function filterByCategory(cat) {
  currentCat = cat;
  showSection("feed");
  setTimeout(() => renderFeed(getFiltered()), 50);
}
window.filterByCategory = filterByCategory;

function searchReports() {
  renderFeed(getFiltered());
}
window.searchReports = searchReports;

async function vote(e, id) {
  e.stopPropagation();
  const r = window._denuncias.find((x) => x.id === id);
  if (!r) return;
  r.userVoted = !r.userVoted;
  r.votes += r.userVoted ? 1 : -1;
  renderFeed(getFiltered());
  try {
    await fetch(`/api/denuncias/${id}/votar`, { method: 'POST' });
  } catch (err) {
    console.error('Error al votar:', err);
  }
}
window.vote = vote;

function openModal(id) {
  const r = window._denuncias.find((x) => x.id === id);
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
    document.getElementById(id).querySelector(".tl-dot").className = "tl-dot tl-pending";
  });
  if (r.status === "review" || r.status === "resolved") {
    document.getElementById("tl-review").querySelector(".tl-dot").className = "tl-dot tl-done";
  }
  if (r.status === "resolved") {
    document.getElementById("tl-escalated").querySelector(".tl-dot").className = "tl-dot tl-done";
    document.getElementById("tl-resolved").querySelector(".tl-dot").className = "tl-dot tl-done";
  }
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
window.openModal = openModal;

function closeModal(e) {
  if (!e || e.target === document.getElementById("modal-overlay") || e.currentTarget.tagName === "BUTTON") {
    document.getElementById("modal-overlay").classList.remove("open");
    document.body.style.overflow = "";
  }
}
window.closeModal = closeModal;

function selectCat(el, cat) {
  document.querySelectorAll(".cat-option").forEach((x) => x.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("selected-cat").value = cat;
}
window.selectCat = selectCat;

function selectSev(el, sev) {
  document.querySelectorAll(".sev-btn").forEach((x) => (x.className = "sev-btn"));
  el.classList.add(`sel-${sev}`);
  document.getElementById("selected-sev").value = sev;
}
window.selectSev = selectSev;

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
      reader.onload = (e) => { img.src = e.target.result; };
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
window.handleFiles = handleFiles;

const dz = document.getElementById("drop-zone");
if (dz) {
  dz.addEventListener("dragover", (e) => { e.preventDefault(); dz.classList.add("drag-over"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("drag-over"));
  dz.addEventListener("drop", (e) => {
    e.preventDefault();
    dz.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

async function submitReport() {
  const title = document.getElementById("report-title").value.trim();
  const desc = document.getElementById("report-desc").value.trim();
  const location = document.getElementById("report-location").value.trim();
  if (!title || !desc || !location) {
    alert("Por favor completa los campos obligatorios: título, descripción y ubicación.");
    return;
  }
  const isAnon = document.getElementById("anon-check").checked;
  const name = isAnon ? "Anónimo" : document.getElementById("report-name").value.trim() || "Anónimo";
  const sev = document.getElementById("selected-sev").value;
  const sevMap = { high: 'alta', medium: 'media', low: 'baja' };
  const coords = window._pendingCoords || { lat: 9.961742, lng: -75.08057 };
  let img = null;
  if (selectedFiles.length > 0 && selectedFiles[0].type.startsWith("image/")) {
    img = await readFileAsDataURL(selectedFiles[0]);
  }
  const body = {
    titulo: title,
    descripcion: desc,
    ubicacion: location,
    categoria: document.getElementById("selected-cat").value,
    gravedad: sevMap[sev] || 'media',
    nombre: name,
    lat: coords.lat,
    lng: coords.lng,
    img: img,
  };
  try {
    const res = await fetch('/api/denuncias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Error del servidor (${res.status})`);
    }
    const created = await res.json();
    const normalized = normalizarDenuncia(created);
    window._denuncias.unshift(normalized);
    document.getElementById("stat-total").textContent = window._denuncias.length;
    document.getElementById("success-banner").classList.add("show");
    setTimeout(() => {
      document.getElementById("report-title").value = "";
      document.getElementById("report-desc").value = "";
      document.getElementById("report-location").value = "";
      document.getElementById("report-name").value = "";
      document.getElementById("report-email").value = "";
      document.getElementById("media-preview").innerHTML = "";
      document.getElementById("anon-check").checked = false;
      selectedFiles = [];
      window._pendingCoords = null;
      document.getElementById("success-banner").classList.remove("show");
      showSection("feed");
    }, 2500);
  } catch (e) {
    alert("Error al enviar denuncia: " + e.message);
  }
}
window.submitReport = submitReport;

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
  window.scrollTo({ top: document.querySelector("header").offsetHeight, behavior: "smooth" });
  if (key === "feed") renderFeed(getFiltered());
  if (key === "map" && window._actualizarMapa) setTimeout(window._actualizarMapa, 50);
}
window.showSection = showSection;
