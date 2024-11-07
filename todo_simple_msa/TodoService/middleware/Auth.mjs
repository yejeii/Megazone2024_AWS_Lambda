// auth.mjs : jwt 유효성 검증 미들웨어

import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

// 환경변수 사용선언
dotenv.config();

// 헤더에서 토큰을 받아 토큰 인증 처리
// 토큰 유효시 next() 호출하여 리턴
export const auth = (req, res, next) => {
    const key = process.env.MY_SECRET;
    // console.log(key);

    try {
        // 토큰 검증
        const user = jwt.verify(req.headers.authorization, key);
        req.user = user;
        next();
    } catch(err) {
        // 인증 실패
        console.log(err.name);

        // 토큰의 비밀키가 일치하지 않는 경우
        if(err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                message: '유효하지 않는 토큰입니다.',
            });
        }

        // 유효시간 만료
        if(err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
    }
};