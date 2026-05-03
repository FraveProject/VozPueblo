import * as model from '../models/denuncias.models.js';

export const getAll = async () => {
  return await model.getAll();
};

export const create = async (data) => {
  if (!data.lat || !data.lng) {
    throw new Error("Ubicación obligatoria");
  }

  return await model.insert(data);
};