process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlD;
if (process.env.NODE_ENV === 'dev') {
    urlD = 'mongodb://localhost:27017/cafe';
} else {
    urlD = 'mongodb://julianmartire1:hayequipo123456@ds263436.mlab.com:63436/hay-equipo';
}
process.env.URLDB = urlD;
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'priv-secret';
process.env.CLIENT_ID_GOOGLE = process.env.CLIENT_ID_GOOGLE || '596025249928-83vfpub6p2j9iprtatq02mn0mdbicjnr.apps.googleusercontent.com';