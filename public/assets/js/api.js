const API_BASE = '/api';

export async function obtenerDenuncias() {
  const res = await fetch(`${API_BASE}/denuncias`);
  if (!res.ok) throw new Error('Error al cargar denuncias');
  return await res.json();
}

export async function crearDenuncia(data) {
  const res = await fetch(`${API_BASE}/denuncias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear denuncia');
  return await res.json();
}
