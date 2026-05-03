import { initMap, renderReports } from './map.js';
import { obtenerDenuncias } from './api.js';

async function start() {
  const map = initMap();
  const denuncias = await obtenerDenuncias();   
    renderReports(map, denuncias);
}

start();