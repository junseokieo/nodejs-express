const express = require('express');
const authRouter = require('./auth');
const playRouter = require('./plays');
const troupeRouter = require('./troupes');
const tokenRouter = require('./token');

const api = express.Router();

api.use('/auth', authRouter);
api.use('/plays', playRouter);
api.use('/troupes', troupeRouter);
api.use('/token', tokenRouter);

module.exports = api;
