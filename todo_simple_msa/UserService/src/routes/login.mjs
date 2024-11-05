import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getUser = () => {
    return { username: 'zoala', password: '456456'};
}

//  POST login 요청이 들어오면 body에 username와 password를 실어서 요청으로 가정해서 jwt를 발급
const login = (app) => {
    app.post('/login', (req, res) => {
        const {username, password} = req.body;
        console.log(username, password);

        // 받은 요청에서 db 에서 가져왔다고 가정 (로그인정보)
        const user = getUser();
        console.log("Retrieved User:", user);

        if(!user || user.password !== password) {
            console.log(password);
            return res.status(401).send({ error: 'please check your password.' });
        }
        console.log('login success');

        // 토큰 생성
        const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "15m" });

        // response
        return res.status(200).json({
            code: 200,
            message: "token is created",
            token: token,
        });
    })
}

export { login };