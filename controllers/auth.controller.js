const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/generate-jwt');

/**
 * Crea un nuevo usuario en la base de datos.
 */
const createUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el email ya existe
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo electrónico',
            });
        }

        // 2. Crear nueva instancia del usuario
        user = new User(req.body);

        // 3. Encriptar la contraseña (Hashing)
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // 4. Guardar el usuario en la base de datos
        await user.save();

        // 5. Generar el JSON Web Token (JWT)
        const token = await generateJWT(user.id, user.name);

        // 6. Enviar respuesta exitosa
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        });
    }
};

/**
 * Autentica un usuario existente.
 */
const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // 1. Verificar si el email existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no son correctos', // Mensaje genérico por seguridad
            });
        }

        // 2. Confirmar si las contraseñas coinciden
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no son correctos', // Mensaje genérico por seguridad
            });
        }

        // 3. Generar nuestro JWT
        const token = await generateJWT(user.id, user.name);

        // 4. Enviar respuesta exitosa
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador',
        });
    }
};

/**
 * Renueva el token de un usuario autenticado.
 */
const renewToken = async (req, res = response) => {
    // El uid y el name vienen del middleware validateJWT que se ejecutó antes
    const { uid, name } = req;

    // Generar un nuevo JWT
    const token = await generateJWT(uid, name);

    // Enviar respuesta
    res.json({
        ok: true,
        uid,
        name,
        token,
    });
};


module.exports = {
    createUser,
    loginUser,
    renewToken,
};