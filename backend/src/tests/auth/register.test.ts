const { registerUser } = require('../../../src/services/UserRegistrationService');
const { findUserByEmail, createUser } = require('../../../src/repositories/UserRepository');
const { hashPassword } = require('../../../src/common/utils/HashPassword');

jest.mock('../../../src/repositories/UserRepository');
jest.mock('../../../src/common/utils/HashPassword');

describe('UserRegistrationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john.doe@dealership.com',
      phone: '1234567890',
      password: 'SecurePass123',
      role: 'admin'
    };

    it('should register user successfully', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        _id: '507f1f77bcf86cd799439011',
        name: validUserData.name,
        email: validUserData.email,
        phone: validUserData.phone,
        password: hashedPassword,
        role: validUserData.role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      createUser.mockResolvedValue(createdUser);

      const result = await registerUser(validUserData);

      expect(result).toEqual(createdUser);
      expect(findUserByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(createUser).toHaveBeenCalledTimes(1);
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        _id: '507f1f77bcf86cd799439012',
        name: 'Jane Smith',
        email: validUserData.email,
        phone: '9876543210',
        password: 'someHashedPassword',
        role: 'customer',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      findUserByEmail.mockResolvedValue(existingUser);

      await expect(registerUser(validUserData))
        .rejects
        .toThrow('Email already registered');

      expect(findUserByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(hashPassword).not.toHaveBeenCalled();
      expect(createUser).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        _id: '507f1f77bcf86cd799439011',
        name: validUserData.name,
        email: validUserData.email,
        phone: validUserData.phone,
        password: hashedPassword,
        role: validUserData.role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      createUser.mockResolvedValue(createdUser);

      await registerUser(validUserData);

      expect(hashPassword).toHaveBeenCalledWith(validUserData.password);
      expect(hashPassword).toHaveBeenCalledTimes(1);
    });

    it('should pass hashed password to repository', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        _id: '507f1f77bcf86cd799439011',
        name: validUserData.name,
        email: validUserData.email,
        phone: validUserData.phone,
        password: hashedPassword,
        role: validUserData.role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      createUser.mockResolvedValue(createdUser);

      await registerUser(validUserData);

      expect(createUser).toHaveBeenCalledWith({
        name: validUserData.name,
        email: validUserData.email,
        phone: validUserData.phone,
        password: hashedPassword,
        role: validUserData.role
      });
    });

    it('should propagate hashing errors', async () => {
      const hashingError = new Error('Hashing failed');

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockRejectedValue(hashingError);

      await expect(registerUser(validUserData))
        .rejects
        .toThrow('Hashing failed');

      expect(hashPassword).toHaveBeenCalledWith(validUserData.password);
      expect(createUser).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const repositoryError = new Error('Database connection failed');

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      createUser.mockRejectedValue(repositoryError);

      await expect(registerUser(validUserData))
        .rejects
        .toThrow('Database connection failed');

      expect(createUser).toHaveBeenCalled();
    });

    it('should assign default role customer', async () => {
      const userDataWithoutRole = {
        name: 'John Doe',
        email: 'john.doe@dealership.com',
        phone: '1234567890',
        password: 'SecurePass123'
      };

      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        _id: '507f1f77bcf86cd799439011',
        name: userDataWithoutRole.name,
        email: userDataWithoutRole.email,
        phone: userDataWithoutRole.phone,
        password: hashedPassword,
        role: 'customer',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      findUserByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      createUser.mockResolvedValue(createdUser);

      const result = await registerUser(userDataWithoutRole);

      expect(createUser).toHaveBeenCalledWith({
        name: userDataWithoutRole.name,
        email: userDataWithoutRole.email,
        phone: userDataWithoutRole.phone,
        password: hashedPassword,
        role: 'customer'
      });
      expect(result.role).toBe('customer');
    });
  });
});
