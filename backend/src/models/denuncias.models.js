import mongoose from 'mongoose';

const denunciaSchema = new mongoose.Schema({
  titulo:      { type: String, required: true, trim: true, maxlength: 100 },
  descripcion: { type: String, default: '' },
  ubicacion:   { type: String, default: '' },
  categoria:   { type: String, enum: ['Vialidad', 'Agua y Drenaje', 'Alumbrado', 'Residuos', 'Seguridad', 'Otro'], default: 'Otro' },
  gravedad:    { type: String, enum: ['baja', 'media', 'alta'], default: 'media' },
  estado:      { type: String, enum: ['pendiente', 'revision', 'resuelto'], default: 'pendiente' },
  nombre:      { type: String, default: 'Anónimo' },
  votos:       { type: Number, default: 0 },
  img:         { type: String, default: null },
  lat:         { type: Number, required: true },
  lng:         { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Denuncia', denunciaSchema);
