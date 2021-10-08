const jwt = require('jsonwebtoken');

// 사용자가 헤더에 토큰을 넣어 보내주면, jwt.verify로 검증, 검증에 성공한 경우 토큰의 내용이 req.decoded에 저장됨.
// req.decoded : 미들웨어간의 요청에 데이터를 전달하는 방법

exports.verifyToken = (req, res, next) => {
    try{
        const token = req.headers.authorization.split('Bearer ')[1];
        console.log(token);
        console.log(process.env.JWT_SECRET);
        req.decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(req.decoded);
        return next();
    }
    catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.stauts(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.stauts(401).json({
            code: 401, 
            message: '유효하지 않은 토큰입니다.',
        });
    }
};
