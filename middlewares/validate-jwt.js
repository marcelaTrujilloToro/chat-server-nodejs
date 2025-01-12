const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  // leer loken
  const token = req.header('x-token');

  if (!token) {
    return res
      .status(401)
      .json({ ok: false, msg: 'No hay token en la petición' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_KEY);

    req.uid = uid;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ ok: false, msg: 'Token no válido' });
  }
};

module.exports = {
  validateJWT,
};
