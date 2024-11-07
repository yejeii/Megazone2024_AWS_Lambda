import fs from 'fs';
import path from 'path';
import client from 'prom-client';   // Prometheus 와 같은 모니터링 시스템과 통합할 수 있는 메트릭 제공 라이브러리

// metrics 파일이 저장될 디렉토리 설정
const metricsDir = path.join(process.cwd(), 'metrics'); // 현재 프로젝트 디렉토리 기준

// /metrics 폴더 존재하지 않으면 생성
if (!fs.existsSync(metricsDir)) {
    fs.mkdirSync(metricsDir, { recursive: true });  // recursive 옵션으로 중첩 디렉토리도 생성 가능
}

// Prometheus 기본 메트릭 수집 활성화
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();    // CPU, 메모리 등 기본 시스템 메트릭 자동 수집

// HTTP 요청 처리 시간 측정을 위한 히스토그램 생성
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',               // 메트림 이름
    help: 'Duration of HTTP requests in ms',        // 메트릭 설명
    labelNames: ['method', 'route', 'code'],        // 라벨 (메서드, 라우트, 상태 코드)
    buckets: [50, 100, 200, 300, 400, 500, 1000]    // 요청 시간 분포를 나누는 버킷
});

// 현재 수집된 Prometheus 메트릭 데이터를 파일에 저장하는 함수
const updateMetricsFile = async () => {
    const currentDate = new Date().toISOString().split('T')[0];     // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const metricsFilePath = path.join(metricsDir, `metrics-${currentDate}.txt`);    // 날짜 기반 파일명 생성

    // Prometheus에서 현재 메트릭 데이터를 가져와서 파일에 저장
    const metricsData = await client.register.metrics();
    fs.writeFileSync(metricsFilePath, metricsData);
};

// 일정 시간마다 메트릭 파일을 업데이트 (60초*3 마다 실행)
setInterval(updateMetricsFile, 60000*3);    // 3 분

// HTTP 요청을 처리하면서 메트릭을 기록하는 미들웨어
export const metricsMiddleware = (req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();      // 요청 시작 시 타이머 시작

    res.on('finish', async () => {
        // 요청 종료 시 타이머 종료 및 메트릭 기록
        end({
            method: req.method,     // HTTP 메서드 (GET, POST 등)
            route: req.route ? req.route.path : '',  // 요청 경로
            code: res.statusCode    // HTTP 상태 코드
        });

        // 요청이 끝난 후 메트릭 파일 갱신
        await updateMetricsFile();
    });

    next();     // 다음 미들웨어로 요청 전달
};

// Prometheus 메트릭 데이터를 제공하는 엔드포인트 핸들러
export const metricsEndpoint = async (req, res, next) => {
    try {
        // Prometheus에서 현재 메트릭 데이터를 가져옴
        const metricsData = await client.register.metrics();

        // 응답의 Content-Type을 Prometheus 메트릭 형식으로 설정
        res.set('Content-Type', client.register.contentType);

        // 메트릭 데이터를 응답으로 전송
        res.end(metricsData);
    } catch (error) {
        // 에러 발생 시 다음 미들웨어로 에러 전달
        next(error);
    }
};
