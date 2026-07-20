// src/routes/auth.routes.ts
const { Router } = require('express');
const { loginController } = require('..//controller/AuthController');
const validateBody  = require('../middlewares/validateRequest');
const { loginSchema } = require('../common/utils/validators/auth.schema');

const authRouter = Router();

// Validate input structure via middleware BEFORE executing controller logic
authRouter.post('/login', validateBody(loginSchema), loginController);

module.exports = authRouter;