import * as service from '../services/denuncias.services.js';

export const obtenerDenuncias = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

export const crearDenuncia = async (req, res) => {
  const nueva = await service.create(req.body);
  res.json(nueva);
};