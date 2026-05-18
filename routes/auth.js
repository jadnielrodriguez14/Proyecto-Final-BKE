const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Importas la conexión que ya creamos
const jwt = require('jsonwebtoken');

// =========================
// RUTA DE REGISTRO
// =========================
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validar datos (Parte 5 del proyecto)
    if (!email || !password) {
        return res.status(400).json({ error: "Email y password son obligatorios" });
    }

    try {
        // 2. Encriptar contraseña (Paso 5)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Guardar usuario en la base de datos (Paso 5)
        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al registrar usuario" });
            }
            // Respuesta exitosa según el PDF
            res.status(201).json({ message: "Usuario creado" });
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

//=========================
//RUTA DE LOGIN
//=========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validar que el usuario envíe ambos campos
    if (!email || !password) {
        return res.status(400).json({ error: "Email y password son obligatorios" });
    }

    try {
        // 2. Buscar al usuario en la base de datos por su email
        const query = 'SELECT * FROM users WHERE email = ?';
        
        db.query(query, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al buscar el usuario en la base de datos" });
            }

            // Si el arreglo "result" está vacío, significa que el correo no existe
            if (result.length === 0) {
                return res.status(401).json({ error: "Credenciales incorrectas (Email no encontrado)" });
            }

            // Tomamos el usuario encontrado
            const user = result[0];

            // 3. Comparar la contraseña ingresada con el hash guardado en la DB
            const coinciden = await bcrypt.compare(password, user.password);

            if (!coinciden) {
                return res.status(401).json({ error: "Credenciales incorrectas (Contraseña mal escrita)" });
            }

            // 4. Si todo está correcto, crear el Token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email }, // Carga de datos útil (Payload)
                process.env.JWT_SECRET,             // Tu llave secreta del archivo .env
                { expiresIn: '1h' }                 // Tiempo de expiración del token
            );

            // 5. Responder al cliente con el mensaje de éxito y el Token
            res.status(200).json({
                message: "Login exitoso",
                token: token
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;

