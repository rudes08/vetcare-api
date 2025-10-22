/*
    Rutas de Mascotas / Pets
    host + /api/pets
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middleware/field-validator');
const { validateJWT } = require('../middleware/validate-jwt');
const { getPets, createPet, updatePet, deletePet } = require('../controllers/pets.controller');

const router = Router();

// --- Todas las rutas de aquí para abajo deben pasar por la validación del JWT ---
// Este es un truco: en lugar de poner validateJWT en cada ruta, lo ponemos una vez aquí
// y se aplicará a todas las rutas definidas después de él.
router.use(validateJWT);

// --- Obtener todas las mascotas del usuario logueado ---
router.get('/', getPets);

// --- Crear una nueva mascota ---
router.post(
    '/',
    [ // Middlewares de validación
        check('name', 'El nombre de la mascota es obligatorio').not().isEmpty(),
        check('species', 'La especie de la mascota es obligatoria').not().isEmpty(),
        validateFields
    ],
    createPet
);

// --- Actualizar una mascota existente ---
router.put(
    '/:id', // Recibimos el ID de la mascota a actualizar por la URL
    [
        check('name', 'El nombre de la mascota es obligatorio').not().isEmpty(),
        check('species', 'La especie de la mascota es obligatoria').not().isEmpty(),
        validateFields
    ],
    updatePet
);

// --- Eliminar una mascota ---
router.delete('/:id', deletePet); // Recibimos el ID de la mascota a eliminar

module.exports = router;