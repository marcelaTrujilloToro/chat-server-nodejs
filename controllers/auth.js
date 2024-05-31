const { response } = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existEmail = await UserModel.findOne({ email });

    if (existEmail) {
      return res
        .status(400)
        .json({ ok: false, msg: 'Credenciales no validas' });
    }

    const user = new UserModel(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    //TOKEN
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDb = await UserModel.findOne({ email });

    if (!userDb) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const validPassword = bcrypt.compareSync(password, userDb.password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ ok: false, msg: 'Contraseña no es válida' });
    }

    //Generar el JWT
    const token = await generateJWT(userDb.id);

    res.json({
      ok: true,
      user: userDb,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Hable con el administrador' });
  }
};

const renewToken = async (req, res = response) => {
  console.log(req.uid);
  const uid = req.uid;

  const token = await generateJWT(uid);

  const user = await UserModel.findById(uid);

  res.json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  createUser,
  login,
  renewToken,
};
