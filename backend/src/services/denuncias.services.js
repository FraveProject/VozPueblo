import Denuncia from '../models/denuncias.models.js';

export const getAll = async () => {
  return await Denuncia.find().sort({ createdAt: -1 });
};

export const create = async (data) => {
  if (data.lat == null || data.lng == null) {
    throw new Error('Ubicación obligatoria');
  }
  const denuncia = new Denuncia(data);
  return await denuncia.save();
};

export const vote = async (id) => {
  const denuncia = await Denuncia.findByIdAndUpdate(
    id,
    { $inc: { votos: 1 } },
    { new: true }
  );
  if (!denuncia) throw new Error('Denuncia no encontrada');
  return denuncia;
};
