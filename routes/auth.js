/*
  path: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { valideFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'Name is required').not().notEmpty(),
    check('password', 'Password is required').not().notEmpty(),
    check('email', 'Email is required').isEmail(),
  ],
  valideFields,
  createUser
);

router.post(
  '/',
  [
    check('password', 'Password is required').not().notEmpty(),
    check('email', 'Email is required').isEmail(),
  ],
  valideFields,
  login
);

router.get('/renew', validateJWT, renewToken);

module.exports = router;
