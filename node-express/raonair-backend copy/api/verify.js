// 이 파일은 미들웨어로, 다른 여러 라우터에서 사용할 수 있도록 만든다.
// 사용자의 토큰이 유효한지를 판별해서 유효하면 그 토큰의 내용을 다른 미들웨어와 공유한다.(req.decoded를 통해)
const jwt = require('jsonwebtoken');

// 사용자가 헤더에 토큰을 넣어 보내주면, jwt.verify로 검증, 검증에 성공한 경우 토큰의 내용이 req.decoded에 저장됨.
// req.decoded : 미들웨어간의 요청에 데이터를 전달하는 방법

exports.verifyToken = (req, res, next) => {
    try{
        //token에 받은 토큰을 저장한다.
        const token = req.headers.authorization.split('Bearer ')[1]; //postman에서 token을 보낼 때 token 앞에 Bearer 을 붙여서 보내기때문에 그 부분을 지우는 코드
        
        // req.decoded에 토큰을 검증한 결과(토큰의 내용)을 저장한다.
        req.decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        return next();
    }
    catch(error){
        // 토큰이 만료된 경우
        if(error.name === 'TokenExpiredError'){
            return res.stauts(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        // 말도안되는 토큰인 경우
        return res.stauts(401).json({
            code: 401, 
            message: '유효하지 않은 토큰입니다.',
        });
    }
};
