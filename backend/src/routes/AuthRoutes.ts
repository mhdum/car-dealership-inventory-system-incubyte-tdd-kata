// src/routes/auth.routes.ts
const { Router } = require('express');
const { loginController } = require('../controllers/auth.controller');
const { validateBody } = require('../middlewares/validateRequest.middleware');
const { loginSchema } = require('../common/utils/validators/auth.schema');

const authRouter = Router();

// Validate input structure via middleware BEFORE executing controller logic
authRouter.post('/login', validateBody(loginSchema), loginController);

module.exports = authRouter;