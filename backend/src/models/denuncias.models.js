let denuncias = [
  {
    id: 1,
    titulo: "Hueco en la carretera",
    lat: 10.047401,
    lng: -75.026707,
    gravedad: "alta"
  },

  {
    id: 2,
    titulo: "Ppsaje sucio en el parque",
    lat: 10.047401,
    lng: -75.026707,
    gravedad: "alta"
  }
];

export const getAll = async () => {
  return denuncias;
};

export const insert = async (data) => {
  const nueva = {
    id: denuncias.length + 1,
    ...data
  };

  denuncias.push(nueva);
  return nueva;
};