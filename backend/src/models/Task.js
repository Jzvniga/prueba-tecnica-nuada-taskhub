const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título de la tarea es obligatorio.'],
        trim: true 
    },
    due: {
        type: Date, 
        required: false,
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } 
});

module.exports = mongoose.model('Task', TaskSchema);