// tests/unit/services/userRegistration.service.test.ts
import { UserRegistrationService } from '../../../src/services/UserRegistrationService';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { PasswordHasher } from '../../../src/utils/PasswordHasher';

jest.mock('../../../src/repositories/UserRepository');
jest.mock('../../../src/utils/PasswordHasher');

describe('UserRegistrationService', () => {
  let userRegistrationService: UserRegistrationService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockPasswordHasher = new PasswordHasher() as jest.Mocked<PasswordHasher>;
    
    userRegistrationService = new UserRegistrationService(
      mockUserRepository,
      mockPasswordHasher
    );

    jest.clearAllMocks();
  });

  describe('register', () => {
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

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userRegistrationService.register(validUserData);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
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

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(userRegistrationService.register(validUserData))
        .rejects
        .toThrow('Email already registered');

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockPasswordHasher.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
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

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      await userRegistrationService.register(validUserData);

      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validUserData.password);
      expect(mockPasswordHasher.hash).toHaveBeenCalledTimes(1);
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

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      await userRegistrationService.register(validUserData);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: validUserData.name,
        email: validUserData.email,
        phone: validUserData.phone,
        password: hashedPassword,
        role: validUserData.role
      });
    });

    it('should propagate hashing errors', async () => {
      const hashingError = new Error('Hashing failed');

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockRejectedValue(hashingError);

      await expect(userRegistrationService.register(validUserData))
        .rejects
        .toThrow('Hashing failed');

      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validUserData.password);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const repositoryError = new Error('Database connection failed');

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockRejectedValue(repositoryError);

      await expect(userRegistrationService.register(validUserData))
        .rejects
        .toThrow('Database connection failed');

      expect(mockUserRepository.create).toHaveBeenCalled();
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

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userRegistrationService.register(userDataWithoutRole as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
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
