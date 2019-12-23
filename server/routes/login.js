const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const app = express();
const jwt = require('jsonwebtoken');

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
})

module.exports = app;
