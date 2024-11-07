// morgan middleware
// 성공한 응답만 처리 -> HTTP status 400 미만인 응답만 로깅, logger 수준 info로 지정

import morgan from "morgan";                // Express 서버에서 발생하는 HTTP 요청을 로깅하는 미들웨어
import logger from "../config/logger.mjs";

const morganMiddleware = morgan((tokens, req, res) => {
    const responseBody = res.locals.body || {}; // Access the captured response body

    const logMessage = `[${tokens.method(req, res)}] ${tokens.url(req, res)} | ${tokens.status(req, res)} | ${tokens.res(req, res, "content-length")} - ${tokens["response-time"](req, res)} ms | [Response] ${JSON.stringify(responseBody)}`;
    const statusCode = res.statusCode;

    // 응답 상태가 500 미만인지 확인(성공 응답)
    if (statusCode < 500) {
        logger.info(logMessage);
    }

    return null; // 로그 출력을 수정하지 않음을 나타내기 위해 null을 반환
});

export default morganMiddleware;
