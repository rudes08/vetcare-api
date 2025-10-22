const jwt = require('jsonwebtoken');

/**
 * Genera un JSON Web Token.
 * @param {string} uid - El ID único del usuario.
 * @param {string} name - El nombre del usuario.
 * @returns {Promise<string>} - Una promesa que resuelve con el token o rechaza con un error.
 */
const generateJWT = (uid, name) => {
    // Envolvemos la generación en una Promesa para poder usar async/await
    return new Promise((resolve, reject) => {

        const payload = { uid, name };

        // jwt.sign(payload, clave_secreta, opciones, callback)
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h' // El token expirará en 2 horas
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT,
}