const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middlewares/authMiddleware'); 

// Importación de express-validator
const { body, validationResult } = require('express-validator');

// ==========================================
// 1. CREAR TAREA (POST)
// ==========================================
router.post(
    '/', 
    verificarToken, // Primera capa: ¿Tiene token válido?
    [
        body('title')
                    .trim()
                    .notEmpty().withMessage('El título es obligatorio.')
                    .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres.'),
                
        body('due_date')
                    .optional({ checkFalsy: true })
                    .isDate().withMessage('La fecha de vencimiento debe ser una fecha válida (AAAA-MM-DD).')
    ], 
    (req, res) => {
        // Verificamos si express-validator atrapó algún error
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            // Si hay errores, respondemos de inmediato con un 400 Bad Request y la lista de fallos
            return res.status(400).json({ errores: errores.array() });
        }

        // Si todo está limpio, procedemos con la lógica normal que ya tenías:
        const { title, description, due_date } = req.body;
        const userId = req.user.id; 

        const query = 'INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)';
        db.query(query, [title, description, due_date || null, userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al guardar la tarea en la base de datos" });
            }
            res.status(201).json({
                message: "Tarea creada con éxito",
                taskId: result.insertId
            });
        });
    }
);

// ==========================================
// 2. OBTENER LAS TAREAS DEL USUARIO LOGUEADO (GET)
// ==========================================
router.get('/', verificarToken, (req, res) => {
    // El middleware nos da el ID del usuario dueño del token
    const userId = req.user.id;

    // Filtramos con WHERE para traer solo sus tareas
    const query = 'SELECT * FROM tasks WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error al obtener las tareas de la base de datos" });
        }
        
        // Devolvemos la lista de tareas encontradas (un arreglo JSON)
        res.status(200).json(results);
    });
});   

// ==========================================
// 3. ACTUALIZAR UNA TAREA (PUT)
// ==========================================
router.put('/:id', verificarToken, (req, res) => {
    const taskId = req.params.id; 
    const userId = req.user.id;   

    const { title, description, status, due_date } = req.body;

    const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?';

    // Ahora pasamos las variables directamente. ¡MySQL aceptará el status felizmente!
    const variables = [
        title, 
        description, 
        status || 'pending', 
        due_date, 
        taskId, 
        userId
    ];

    db.query(query, variables, (err, result) => {
        if (err) {
            console.error("Error en MySQL:", err.message);
            return res.status(500).json({ error: "Error al actualizar la tarea" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permiso" });
        }

        res.json({ message: "¡Tarea actualizada con éxito!" });
    });
});

// ==========================================
// 4. ELIMINAR UNA TAREA (DELETE)
// ==========================================
router.delete('/:id', verificarToken, (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Consulta que elimina la tarea SOLO si le pertenece al usuario logueado
    const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';

    db.query(query, [taskId, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar la tarea" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permiso" });
        }

        res.json({ message: "Tarea eliminada con éxito" });
    });
});

module.exports = router;