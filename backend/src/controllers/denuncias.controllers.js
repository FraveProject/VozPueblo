import * as service from '../services/denuncias.services.js';

export const obtenerDenuncias = async (req, res) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const crearDenuncia = async (req, res) => {
  try {
    const nueva = await service.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const votarDenuncia = async (req, res) => {
  try {
    const denuncia = await service.vote(req.params.id);
    res.json(denuncia);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
