let markerGroup;

export function initMap() {
  const map = L.map('map').setView([9.961742, -75.08057], 4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  markerGroup = L.layerGroup().addTo(map);

  map.on('click', function (e) {
    window._pendingCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
    showSection('form');
  });

  return map;
}

const colors = {
  high: "red",
  medium: "orange",
  low: "green"
};

export function renderReports(map, denuncias) {
  markerGroup.clearLayers();
  denuncias.forEach(r => {
    L.circleMarker([r.lat, r.lng], {
      radius: 8,
      fillColor: colors[r.severity] || "blue",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    })
    .addTo(markerGroup)
    .bindPopup(`<b>${r.title}</b><br>Gravedad: ${r.severity}`);
  });
}
