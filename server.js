const express = require('express'); // Importar Express
const app = express(); // Crear la aplicación
const cors = require('cors'); // Importar CORS para permitir solicitudes desde el frontend

app.use(cors()); // Habilitar CORS para todas las rutas

app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

app.use(express.json()); // Middleware para entender JSON

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Esto hace que las rutas empiecen con /api/auth

const taskRoutes = require('./routes/tasks'); // 1. Importar las rutas de tareas
app.use('/api/tasks', taskRoutes);            // 2. Conectarlas con el prefijo /api/tasks

app.get('/api/health', (req, res) => {
    res.json({ "status": "ok" });
});

const PORT = 3000;

app.use((err, req, res, next) => {
    // 1. Registramos el error real con todo el detalle en la terminal de VS Code
    console.error("❌ ERROR DETECTADO EN EL SERVIDOR:", err.stack);

    // 2. Respondemos al cliente con un formato JSON unificado y seguro
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: "Ocurrió un error inesperado en el servidor de forma interna.",
        // Solo mostramos el detalle técnico si estamos desarrollando, para proteger la seguridad
        detalles: process.env.NODE_ENV === 'development' ? err.message : null
    });
});


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});



