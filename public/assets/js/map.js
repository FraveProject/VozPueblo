import { crearDenuncia } from './api.js';


export function initMap() {
  const map = L.map('map').setView([9.961742, -75.08057], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  map.on('click', async function(e) {
  const { lat, lng } = e.latlng;

  const titulo = prompt("Título de la denuncia:");

  if (!titulo) return;

  await crearDenuncia({ titulo, lat, lng });

  alert("Denuncia registrada");
  });

  return map;
}

const colors = {
  alta: "red",
  media: "orange",
  baja: "green"
};

export function renderReports(map, denuncias) {
  denuncias.forEach(r => {
    const color = colors[r.gravedad] || "blue";

    L.circleMarker([r.lat, r.lng], {
      radius: 8,
      fillColor: color,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup(`
      <b>${r.titulo}</b><br>
      Gravedad: ${r.gravedad}
    `);
  });
}
