const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Obtener el token que viene en las cabeceras (Headers) de la petición
    const authHeader = req.headers['authorization'];
    
    // El formato estándar profesional es: "Bearer <TOKEN>"
    // Con esto verificamos si existe y extraemos solo el string del token
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Si no hay token, denegar el acceso de inmediato
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // 3. Verificar si el token es válido usando nuestra palabra secreta del .env
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Guardar los datos del usuario dentro del objeto 'req' (request)
        // Esto es un truco genial porque cualquier ruta que use este middleware 
        // sabrá exactamente qué ID de usuario está haciendo la petición.
        req.user = verificado;

        // 5. Todo está en orden, dar luz verde para continuar a la ruta
        next();
    } catch (error) {
        // Si el token expiró o fue alterado falsamente
        res.status(403).json({ error: "Token inválido o expirado." });
    }
};

module.exports = verificarToken;