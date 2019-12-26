const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

let verificarAdmin = (req, res, next) => {
    const usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE')
        next();
    else {
        return res.json({
            ok: false,
            err: {
                message: 'No tiene permisos'
            }
        })
    }
};

let verificarTokenImg = (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificarToken,
    verificarAdmin,
    verificarTokenImg
}