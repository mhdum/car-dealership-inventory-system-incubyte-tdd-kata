import { type Request,type  Response,type NextFunction } from 'express';
const { verifyToken } = require('../common/utils/JwtToken'); // Assumes verifyToken helper exists

export interface AuthenticatedRequest extends Request {
  user?: any;
}

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication token missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication token missing or invalid' });
  }
}

module.exports = {authenticate}