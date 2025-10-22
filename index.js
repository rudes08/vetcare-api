require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// 1. Crear el servidor
const app = express();

// 2. Conectar a la BD
dbConnection();

// 3. Middlewares
app.use(cors()); // Permitir peticiones de otros dominios
app.use(express.json()); // Leer y convertir el body a JSON

// 4. Rutas (las definiremos más adelante)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pets', require('./routes/pets.routes'));

// 5. Escuchar en el puerto
app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT}`);
});