import winston from "winston";
import path from "path";
import fs from "fs";
import winstonDailyRotate from "winston-daily-rotate-file";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Writable } from "stream";

// AWS 설정
const client = new DynamoDBClient({region: process.env.REGION});

// 로그를 DynamoDB 에 저장
const saveLogToDynamoDB = async (log) => {
    const params = {
        TableName: process.env.DB_TABLE,
        Item: {
            id: { S: Date.now().toString() }, // 유니크한 ID 생성
            log: { S: log }
        }
    };

    try {
        const command = new PutItemCommand(params);
        const data = await client.send(command);
        console.log('Log saved to DynamoDB:', data);
    } catch (err) {
        console.error('Error saving log to DynamoDB:', err);
    }
}

// 로그를 저장할 디렉토리 생성. 없으면 생성
// 저장경로 : src/logs
const logDirectory = path.join(path.resolve(), "logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// 로그 레벨 정의
// 레벨이 1인 로그가 들어오면 error 를 제외한 warn.logs, info.log, debug.log(하위딴) 에 해당 로그가 기록됨
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

// 구성 정의
const logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        }),
    ),
    transports: [
        // winston-daily-rotate-file 을 사용하여 각 로그 수준에 대한 파일 전송
        new winstonDailyRotate({
            level: "error",
            dirname: path.join(logDirectory, "error"),
            filename: "error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true, // 회전된 로그 파일에 대한 압축 활성화
            maxSize: "20m", // 로그 파일 크기가 20MB를 초과하면 회전
            maxFiles: "30d", // 30일 동안 로그 보관
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                }),
            ),
        }),
        new winstonDailyRotate({
            level: "warn",
            dirname: path.join(logDirectory, "warn"),
            filename: "warning-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                }),
            ),
        }),
        new winstonDailyRotate({
            level: "info",
            dirname: path.join(logDirectory, "info"),
            filename: "info-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                }),
            ),
        }),
        new winstonDailyRotate({
            level: "debug",
            dirname: path.join(logDirectory, "debug"),
            filename: "debug-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                }),
            ),
        }),
        // DynamoDB로 로그 저장
        new winston.transports.Stream({
            stream: new Writable({
                write: (chunk, encoding, callback) => {
                    // 로그를 DynamoDB에 저장하는 함수 호출
                    saveLogToDynamoDB(chunk.toString().trim());
                    callback();
                },
            }),
        }),
    ],
    exceptionHandlers: [
        // 캐치되지 않은 (정의되지 않은 레벨) 예외를 기록하는 예외 처리기
        new winstonDailyRotate({
            dirname: path.join(logDirectory, "except"),
            filename: "except-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "30d",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
                }),
            ),
        }),
        new winston.transports.Stream({
            stream: new Writable({
                write: (chunk, encoding, callback) => {
                    // 로그를 DynamoDB에 저장하는 함수 호출
                    saveLogToDynamoDB(chunk.toString().trim());
                    callback();
                },
            }),
        }),
    ],
    exitOnError: false, // 캐치되지 않은 예외를 기록한 후 애플리케이션 실행을 계속합니다.
});

export default logger;
