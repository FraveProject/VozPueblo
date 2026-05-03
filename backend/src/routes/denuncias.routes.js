import { Router } from 'express';
import {
  obtenerDenuncias,
  crearDenuncia
} from '../controllers/denuncias.controllers.js';

const router = Router();

router.get('/denuncias', obtenerDenuncias);
router.post('/denuncias', crearDenuncia);

export default router;