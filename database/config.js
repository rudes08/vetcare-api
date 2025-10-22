const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Base de datos conectada (MongoDB)');
    } catch (error) {
        console.log(error);
        throw new Error('❌ Error al iniciar la base de datos');
    }
}

module.exports = { dbConnection }