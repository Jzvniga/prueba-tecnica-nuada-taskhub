const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado exitosamente');
    } catch (err) {
        console.error('ERROR de conexión a MongoDB:', err.message);
        process.exit(1); // Sale del proceso con error
    }
};

module.exports = connectDB;