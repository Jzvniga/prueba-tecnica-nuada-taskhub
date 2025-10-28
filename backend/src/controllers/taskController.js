const Task = require('../models/Task');

// Función auxiliar para respuestas consistentes
const sendResponse = (res, statusCode, data = null, error = null) => {
    res.status(statusCode).json({ data, error });
};

// 1. POST /api/tasks: Crea una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const { title, due } = req.body;

        // Validación básica (además de la de Mongoose)
        if (!title) {
            return sendResponse(res, 400, null, 'El campo "title" es obligatorio.');
        }

        const newTask = new Task({ title, due });
        const task = await newTask.save();
        
        sendResponse(res, 201, task); // 201 Created
        
    } catch (err) {
        // Mongoose Validation Error (400 Bad Request)
        if (err.name === 'ValidationError') {
            return sendResponse(res, 400, null, err.message);
        }
        // Otros errores del servidor (500 Internal Server Error)
        sendResponse(res, 500, null, 'Error al crear la tarea: ' + err.message);
    }
};

// 2. GET /api/tasks: Lista y filtra tareas
exports.getTasks = async (req, res) => {
    try {
        const { q } = req.query; // Captura el parámetro de búsqueda

        let query = {};
        
        // Implementación del filtro de búsqueda (case-insensitive substring)
        if (q) {
            query.title = { $regex: q, $options: 'i' }; 
            // $regex para búsqueda de subcadena, $options: 'i' para que sea case-insensitive
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 }); // Ordenar por creación descendente
        
        sendResponse(res, 200, tasks); // 200 OK
        
    } catch (err) {
        sendResponse(res, 500, null, 'Error al obtener las tareas: ' + err.message);
    }
};