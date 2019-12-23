const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

app.post('/login', (req, res) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usr) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        } else if (!usr) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        } else if (!bcrypt.compareSync(body.password, usr.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecta'
                }
            });
        }

        const token = jwt.sign({
            usuario: usr
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usr,
            token
        })

    })
});

// Config Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID_GOOGLE,
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async (req, res) => {
    const token = req.body.idtoken;

    const googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usr) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else {
            if (usr) {
                if (usr.google === false) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Debe de usar su autenticacion normal'
                        }
                    })
                } else {
                    const token = jwt.sign({
                        usuario: usr
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usr,
                        token
                    })
                }
            } else {
                // Si usuario no existe
                let usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usr) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        })
                    } else {
                        const token = jwt.sign({
                            usuario: usr
                        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                        return res.json({
                            ok: true,
                            usuario: usr,
                            token
                        })
                    }
                });
            }
        }
    });
});

module.exports = app;
