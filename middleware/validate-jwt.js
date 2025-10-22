const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    // Leer el Token de la cabecera (header)
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición o el formato no es válido'
        });
    }

    // Extraemos solo el token, quitando el "Bearer " del inicio
    const token = authHeader.split(' ')[1];

    try {
        // Verificar el token
        const { uid, name } = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Adjuntar el uid y name a la request
        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    // Si todo está bien, continuar
    next();
}

module.exports = {
    validateJWT,
}