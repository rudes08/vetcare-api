const { Schema, model } = require('mongoose');

const PetSchema = Schema({
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true // Ej: 'Canino', 'Felino'
    },
    breed: {
        type: String
    },
    age: {
        type: Number
    },
    owner: {
        type: Schema.Types.ObjectId, // Esto crea una referencia al ID de otro objeto
        ref: 'User',                 // El objeto al que se hace referencia es un 'User'
        required: true
    }
});

// Modificamos el método toJSON para no devolver campos que no nos interesan
// y para cambiar el nombre de _id a uid por consistencia.
PetSchema.methods.toJSON = function() {
    const { __v, _id, ...pet } = this.toObject();
    pet.uid = _id;
    return pet;
}

module.exports = model('Pet', PetSchema);