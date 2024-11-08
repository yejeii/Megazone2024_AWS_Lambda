import dotenv from 'dotenv';
import express from 'express';
import errorMiddleware from './middleware/ErrorMiddleware.mjs';
import morganMiddleware from './middleware/MorganMiddleware.mjs';
import { metricsMiddleware, metricsEndpoint } from "./config/metrics.mjs";
import { login as setUpLoginRoute } from './routes/login.mjs';
import { taskCRUD as setUpTaskRoute } from "./routes/tasks.mjs";
import cors from 'cors';        // CORS 패키지


dotenv.config();

const app = express();
app.use(express.json());

// 특정 도메인 요청 허용 CORS 설정
const corsOptions = {
    origin: 'http://localhost:63342',   // 허용할 도메인
    credentials: true,
    // optionsSuccessStatus: 200           // 일부 브라우저에서의 CORS 요청 실패 방지
};

app.use(cors(corsOptions));

// Middleware to capture the response body
app.use((req, res, next) => {
    const originalJson = res.json;

    res.json = function (body) {
        res.locals.body = body; // Capture the response body
        return originalJson.call(this, body); // Call the original `res.json` method
    };

    next();
});

app.use(morganMiddleware);          // 요청 처리 로깅
app.use(metricsMiddleware);         // Prometheus metrics 기록
app.use(errorMiddleware);           // 에러 미들웨어 & 에러 로깅



// application 라우팅 설정
setUpLoginRoute(app);   // 로그인 엔드포인트
setUpTaskRoute(app);    // 태스트 인증 엔드포인트
app.get('/metrics', metricsEndpoint);    // Prometheus metrics 를 제공하는 엔드포인트 정의


app.listen(3002, () => {
    console.log('ToDoService is running on port 3002');
});

