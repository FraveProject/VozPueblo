import { initMap, renderReports } from './map.js';
import { obtenerDenuncias } from './api.js';

async function start() {
  const map = initMap();
  window._map = map;

  window._actualizarMapa = () => {
    if (window._map) {
      window._map.invalidateSize();
      renderReports(window._map, window._denuncias);
    }
  };

  try {
    const raw = await obtenerDenuncias();
    window._denuncias = raw.map(window.normalizarDenuncia);
    document.getElementById('stat-total').textContent = window._denuncias.length;
    document.getElementById('stat-resolved').textContent = window._denuncias.filter(d => d.status === 'resolved').length;
    renderReports(map, window._denuncias);
    if (typeof renderFeed === 'function') {
      renderFeed(window._denuncias);
    }
  } catch (err) {
    console.error('Error al cargar denuncias:', err);
    window._denuncias = [];
  }
}

start();
