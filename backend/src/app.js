// backend/src/app.js
require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

// Conexión a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Permite a Express parsear JSON del body de las peticiones
app.use(cors()); // Habilita CORS para todas las rutas
// Rutas
app.use('/api/tasks', taskRoutes);

// Manejo de errores 500 básico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        data: null, 
        error: 'Algo salió mal en el servidor.' // Respuesta consistente con estructura { data, error }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));