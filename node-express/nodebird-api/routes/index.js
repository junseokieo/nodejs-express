const express = require('express');
const { v4: uuidv4} = require('uuid');
const {User, Domain } = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.post('/domain', isLoggedIn, async (req, res, next) => {
    try {
        await Domain.create({
            UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(),
        });
        res.redirect('/');
    }catch (err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
