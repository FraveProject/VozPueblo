import { Router } from 'express';
import {
  obtenerDenuncias,
  crearDenuncia,
  votarDenuncia
} from '../controllers/denuncias.controllers.js';

const router = Router();

router.get('/denuncias', obtenerDenuncias);
router.post('/denuncias', crearDenuncia);
router.post('/denuncias/:id/votar', votarDenuncia);

export default router;
