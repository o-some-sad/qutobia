import { ZodError } from "shared";
import ApiError from "../utilities/ApiErrors";

export const handleErrorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message })
  } else if (err.code === 11000 || err.message.includes('duplicate key')) {
    res.status(409).json({ status: 'fail', message: err.message });
  } else if (err instanceof ZodError) {
    res.status(422).json({ status: 'fail', message: JSON.parse(err.message) });
  } else {
    res.status(422).json({ status: 'fail', message: err.errors || err.message });
  }
}
