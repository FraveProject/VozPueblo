import 'dotenv/config';
import app from './src/app.js';
import { conectarDB } from './src/db/conexion.js';

const PORT = process.env.PORT || 3000;

await conectarDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});