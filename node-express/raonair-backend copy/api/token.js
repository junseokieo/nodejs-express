// token의 발급과 테스트를 진행할 라우터
const express = require('express');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv')
const { verifyToken } = require('./verify');
const { User } = require('../models/user');

dotenv.config();
const router = express.Router();

router.post('/', async (req, res, next) => {
    console.log(req.body.name);
    console.log(process.env.JWT_SECRET);
    try{
        const token = jwt.sign({
            name: req.body.name,
        }, process.env.JWT_SECRET,{
            expiresIn: '10m',
            issuer: 'raonair',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버에러',
        });
    }
});

router.get('/test', verifyToken, (req, res, next) => {
    res.json(req.decoded);
});

module.exports = router;
