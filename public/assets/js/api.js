export async function obtenerDenuncias() {
  const res = await fetch('http://localhost:3000/api/denuncias');
  return await res.json();
}

export async function crearDenuncia(data) {
  await fetch('http://localhost:3000/api/denuncias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
