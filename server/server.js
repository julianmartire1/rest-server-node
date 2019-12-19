require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/usuarios'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
    if (err) throw err;

    console.log('BN ONLINE', process.env.NODE_ENV);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000)
})