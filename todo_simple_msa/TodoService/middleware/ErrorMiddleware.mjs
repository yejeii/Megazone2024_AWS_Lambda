// 에러를 처리할 미들웨어

import logger from "../config/logger.mjs";

function errorMiddleware(error, req, res, next) {
    const statusCode = error.status || 500; // 상태 코드 기본값 500 설정
    res.status(statusCode).send(error.message);

    const stackLines = error.stack ? error.stack.split("\n") : [];
    const truncatedStack = stackLines.slice(0, 5).join("\n");
    const reqBodyString = req.body ? JSON.stringify(req.body) : "{}";

    logger.error(
        `[${req.method}] ${req.path} | ${statusCode} | [REQUEST] ${reqBodyString} | ${truncatedStack}`,
    );
}

export default errorMiddleware;
