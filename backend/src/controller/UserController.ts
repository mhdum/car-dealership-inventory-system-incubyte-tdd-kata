import { type Request, type Response } from 'express';
const { registerUser } = require('../services/UserRegistrationService');

interface RegisterRequestBody {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: string;
}

const register = async (
  req: Request<{}, {}, RegisterRequestBody>, 
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    const user = await registerUser({
      name,
      email,
      phone,
      password,
      role
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json(userResponse);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = {
  register
};
