import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUser } from '../users.js';

dotenv.config();

const secretKey = process.env.MY_SECRET;

//  POST login 요청이 들어오면 body에 username와 password를 실어서 요청으로 가정해서 jwt를 발급
const login = (app) => {
    app.post('/login', (req, res) => {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // 받은 요청에서 db 에서 가져왔다고 가정 (로그인정보)
        const user = findUser(username);
        console.log("User retrieved!");

        if(!user || user.password !== password) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }
        console.log('login success');

        // 토큰 생성
        const token = jwt.sign(user, secretKey, { expiresIn: "15m" });

        // response
        return res.status(200).json({
            code: 200,
            message: "token is created",
            token: token,
        });
    })
}

export { login };