const { Router } = require('express');
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const User = require('../models/User');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sessionToken = await UserService.signIn({ email, password });

      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }})

  .get('/me', [authenticate], async (req, res, next) => {
    try {
      res.json(req.user);
    } catch(e) {
      next(e);
    }
  })  

  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.send(users);
    } catch (error) {
      next(error);
    }
  })

  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });


