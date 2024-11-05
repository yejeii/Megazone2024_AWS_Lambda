import { auth } from '../middleware/Auth.mjs';

// 미들웨어를 받아서 검증하는 엔드포인트
const payload = (app) => {
    app.get('/payload', auth, (req, res) => {
        console.log(req.user);

        return res.status(200).json({
            code: 200,
            message: '토큰이 정상입니다.',
            data: {
                username: req.user.username,
            }
        })
        // res.redirect('/welcome');
    });
};

export { payload };