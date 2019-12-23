const express = require('express');
const fileUpload = require('express-fileupload')
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Validar tipo

    let tipos = ['productos', 'usuarios'];

    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tipos.join(', '),
                tipo
            }
        });
    }

    const archivo = req.files.archivo;
    const nombreCortado = archivo.name.split('.');
    const extencion = nombreCortado[nombreCortado.length - 1];

    // Extenciones permitidas
    const extenciones = ['png', 'jpg', 'gif', 'jpeg'];

    if (extenciones.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extenciones.join(', '),
                extencion
            }
        });
    }

    // Cambio de nombre del archivo
    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(400).json({
                ok: false,
                err
            });
        if(tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivo);
        else {
            if(tipo === 'productos')
                imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borrarArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borrarArchivo(img, tipo) {
    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;