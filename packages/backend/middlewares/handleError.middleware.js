import { ZodError } from "zod";
import ApiError from "../utilities/apiError.js";
import { logger } from "../utilities/logger.js";

export const handleErrorMiddleware = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    logger.error(err.message, {
      stack: err.stack
    })
    res.status(err.statusCode).json({ status: 'fail', message: err.message });
  } else if (err.code === 11000 || err.message.includes('duplicate key')) {
    //TODO: use instanceof to check if it's a mongoose error
    logger.error(err.message, {
      stack: err.stack
    })
    res.status(409).json({ status: 'fail', message: err.message });
  } else if (err instanceof ZodError) {
    logger.error(err.message, {
      stack: err.stack,
      issues: err.issues
    })
    res.status(422).json({ status: 'fail', message: JSON.parse(err.message) });
  } else {
    logger.error(err.errors || err.message, {
      stack: err.stack
    })
    res.status(422).json({ status: 'fail', message: err.errors || err.message });
  }
}
