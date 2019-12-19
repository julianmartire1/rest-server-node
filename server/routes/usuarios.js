
const express = require('express');
const Usuario = require('../models/usuario');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;
    let estado = req.query.estado || true;

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado }, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    of: false,
                    err
                })
            }

            Usuario.count({ estado }, (err, cont) => {
                if (err) {
                    return res.status(400).json({
                        of: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    cont
                })
            })
        });
});

app.post('/usuario', (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                of: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usr) => {
        if (err) {
            return res.status(400).json({
                of: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usr
        });
    });
});

app.delete('/usuario/:id', (req, res) => {
    const id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usr) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usr) => {
        if (err) {
            return res.status(400).json({
                of: false,
                err
            })
        }

        if (!usr) {
            return res.status(400).json({
                of: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usr
        });
    });
});

module.exports = app;