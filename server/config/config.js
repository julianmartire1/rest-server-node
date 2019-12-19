process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlD;
/* if(process.env.NODE_ENV === 'dev') {
    urlD = 'mongodb://localhost:27017/cafe';
} else { */
    urlD = 'mongodb://julianmartire1:hayequipo123456@ds263436.mlab.com:63436/hay-equipo';
/* } */
process.env.URLDB = urlD;