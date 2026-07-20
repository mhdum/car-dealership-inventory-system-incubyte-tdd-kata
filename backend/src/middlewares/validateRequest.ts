import { type Request, type Response, type NextFunction } from "express";
const { HTTP_STATUS } = require("../common/config/constants");

const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Use Zod's safeParse instead of Joi's schema.validate
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // 2. Map Zod issues into field-specific error objects
      const errors = result.error.issues.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Replace req.body with the sanitized/parsed data (applies .trim(), .lowercase(), defaults, etc.)
    req.body = result.data;

    next();
  };
};

module.exports = validateBody;