import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';        // env 환경변수 라이브러리
import { login as setUpLoginRoute } from './src/routes/login.mjs';
import { payload as setUpAddRoute } from './src/routes/payload.mjs';

dotenv.config();

const app = express();
const PORT = 3001;

/*
- form 으로 제출되는 값은 x-www-form-urlencoded 형태이므로 express.json()으로는 값을 해석할 수 없다.
- extended 옵션 정의
extended: false -> NodeJs에 기본으로 내장된 querystring 모듈을 사용.
extended: true -> 추가로 설치가 필요한 qs 모듈을 사용.
false로 지정하면 오류발생.
*/
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

setUpLoginRoute(app);
setUpAddRoute(app);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});