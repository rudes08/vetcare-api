/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth.controller');
const { validateFields } = require('../middleware/field-validator');
const { validateJWT } = require('../middleware/validate-jwt');

const router = Router();

// --- Crear un nuevo usuario ---
router.post(
    '/new',
    [ // Middlewares de validación
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es inválido').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
        validateFields // Middleware que revisa los errores de los 'check' anteriores
    ],
    createUser
);

// --- Login de usuario ---
router.post(
    '/',
    [ // Middlewares de validación
        check('email', 'El email es inválido').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validateFields
    ],
    loginUser
);

// --- Renovar Token ---
// A esta ruta solo se podrá acceder si el token es válido.
// El middleware validateJWT se ejecuta primero.
router.get('/renew', validateJWT, renewToken);


module.exports = router;