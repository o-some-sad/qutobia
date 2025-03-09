//@ts-check
import path from 'node:path';
import winston from 'winston'

const MASTER_LOG_PATH = process.env.MASTER_LOG_PATH || path.join(
    process.cwd(),
    "master.log"
)

const formatter = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  });
  

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },

    transports: [
        new winston.transports.File({ filename: MASTER_LOG_PATH, 
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            )

         }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                formatter
            )
        })
    ],
});


logger.error("hello world", {
    stack: new Error().stack
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}