const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req, res = response, next) => {

    // Manejo de errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped() // Muestra los errores de una forma más legible
        });
    }

    // Si no hay errores, llama a la siguiente función (el controlador)
    next();
}

module.exports = {
    validateFields,
}