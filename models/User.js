const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'USER_ROLE' }
});

// Esto es para limpiar la respuesta JSON y no exponer la contraseña
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id; // Renombramos _id por uid
    return user;
}

module.exports = model('User', UserSchema);