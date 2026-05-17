import express from 'express';
import cors from 'cors';
import denunciasRoutes from './src/routes/denuncias.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static('public'));

// API
app.use('/api', denunciasRoutes);

export default app;