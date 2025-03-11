//@ts-check

/**
 *
 * @param {import('zod').ZodTypeAny} schema
 * @returns
 */
export default function validateSchema(schema) {
  /**@type {import("express").Handler} */
  return function (req, res, next) {
    if (req.method !== "POST" && req.method !== "PATCH")
      return next(new Error("Expected POST or PATCH request"));
    if (req.headers["content-type"] !== "application/json")
      return next(new Error("Expected json body"));

    const result = schema.safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      return next();
    } else {
      return next(result.error);
    }
  };
}
