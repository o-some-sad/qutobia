import { ZodError } from "zod";
import ApiError from "../utilities/apiError.js";

export const handleErrorMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ status: 'fail', message: err.message });
  } else if (err.code === 11000 || err.message.includes('duplicate key')) {
    res.status(409).json({ status: 'fail', message: err.message });
  } else if (err instanceof ZodError) {
    res.status(422).json({ status: 'fail', message: JSON.parse(err.message) });
  } else {
    res.status(422).json({ status: 'fail', message: err.errors || err.message });
  }
}
