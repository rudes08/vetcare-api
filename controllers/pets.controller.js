const { response } = require('express');
const Pet = require('../models/Pet');

// --- Obtener Mascotas ---
const getPets = async (req, res = response) => {
    try {
        // Buscamos en la BD todas las mascotas cuyo 'owner' sea el 'uid' del usuario
        // que viene en la request (gracias al middleware validateJWT).
        const pets = await Pet.find({ owner: req.uid });

        res.json({
            ok: true,
            pets
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

// --- Crear Mascota ---
const createPet = async (req, res = response) => {
    // Creamos una nueva instancia del modelo Pet con los datos del body
    const pet = new Pet(req.body);

    try {
        // Asignamos el dueño de la mascota. El req.uid nos lo da el JWT.
        pet.owner = req.uid;

        // Guardamos la mascota en la base de datos
        const savedPet = await pet.save();

        res.status(201).json({
            ok: true,
            pet: savedPet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

// --- Actualizar Mascota ---
const updatePet = async (req, res = response) => {
    const petId = req.params.id; // Obtenemos el ID de la mascota de la URL
    const ownerId = req.uid;     // Obtenemos el ID del dueño desde el token

    try {
        // 1. Verificar que la mascota existe
        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró ninguna mascota con ese ID'
            });
        }

        // 2. Verificar que el usuario que intenta actualizar es el dueño
        if (pet.owner.toString() !== ownerId) {
            return res.status(401).json({ // 401 Unauthorized
                ok: false,
                msg: 'No tiene permiso para editar esta mascota'
            });
        }

        // 3. Si todo está bien, actualizamos con los nuevos datos
        const newPetData = {
            ...req.body,
            owner: ownerId // Nos aseguramos de mantener el dueño original
        }

        const updatedPet = await Pet.findByIdAndUpdate(petId, newPetData, { new: true }); // {new: true} para que devuelva el doc actualizado

        res.json({
            ok: true,
            pet: updatedPet
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}

// --- Eliminar Mascota ---
const deletePet = async (req, res = response) => {
    const petId = req.params.id;
    const ownerId = req.uid;

    try {
        // 1. Verificar que la mascota existe
        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró ninguna mascota con ese ID'
            });
        }

        // 2. Verificar que el usuario que intenta eliminar es el dueño
        if (pet.owner.toString() !== ownerId) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para eliminar esta mascota'
            });
        }

        // 3. Si todo está bien, eliminamos la mascota
        await Pet.findByIdAndDelete(petId);

        res.json({
            ok: true,
            msg: 'Mascota eliminada correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor'
        });
    }
}


module.exports = {
    getPets,
    createPet,
    updatePet,
    deletePet
}