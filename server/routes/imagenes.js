const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.get('/imagen/:tipo/:img', (req, res) => {
    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
    }

    const noImg = path.resolve(__dirname, '../assets/no-image.jpeg');
    res.sendFile(noImg);
})

module.exports = app;