const { response } = require('express');
const UserModel = require('../models/user');

const getUsers = async (req, res = response) => {
  const from = Number(req.query.from) || 0;

  //retornar todos los id que no sean yo mismo
  const users = await UserModel.find({ _id: { $ne: req.uid } })
    .sort('-online')
    .skip(from)
    .limit(20);

  res.json({ ok: true, users, from });
};

module.exports = {
  getUsers,
};
