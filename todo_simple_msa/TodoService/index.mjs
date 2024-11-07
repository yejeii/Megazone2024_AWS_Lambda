import dotenv from 'dotenv';
import express from 'express';
import errorMiddleware from './middleware/ErrorMiddleware.mjs';
import morganMiddleware from './middleware/MorganMiddleware.mjs';
import { metricsMiddleware, metricsEndpoint } from "./config/metrics.mjs";
import { login as setUpLoginRoute } from './routes/login.mjs';
import { taskCRUD as setUpTaskRoute } from "./routes/tasks.mjs";

dotenv.config();

const app = express();
app.use(express.json());
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

