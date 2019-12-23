require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// public
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
    if (err) throw err;

    console.log('BN ONLINE', process.env.NODE_ENV);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000)
})