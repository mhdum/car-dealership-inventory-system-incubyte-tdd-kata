// tests/unit/services/userRegistration.service.test.ts
import { UserRegistrationService } from '../../../src/services/UserRegistrationService.js';
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
      email: 'john.doe@dealership.com',
      password: 'SecurePass123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'dealer'
    };

    it('should register user successfully', async () => {
      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        id: '123456',
        email: validUserData.email,
        password: hashedPassword,
        firstName: validUserData.firstName,
        lastName: validUserData.lastName,
        role: validUserData.role,
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
        id: '789',
        email: validUserData.email,
        password: 'someHashedPassword',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'manager',
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
        id: '123456',
        email: validUserData.email,
        password: hashedPassword,
        firstName: validUserData.firstName,
        lastName: validUserData.lastName,
        role: validUserData.role,
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
        id: '123456',
        email: validUserData.email,
        password: hashedPassword,
        firstName: validUserData.firstName,
        lastName: validUserData.lastName,
        role: validUserData.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      await userRegistrationService.register(validUserData);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: validUserData.email,
        password: hashedPassword,
        firstName: validUserData.firstName,
        lastName: validUserData.lastName,
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

    it('should assign default role user', async () => {
      const userDataWithoutRole = {
        email: 'john.doe@dealership.com',
        password: 'SecurePass123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const hashedPassword = 'hashed_SecurePass123';
      const createdUser = {
        id: '123456',
        email: userDataWithoutRole.email,
        password: hashedPassword,
        firstName: userDataWithoutRole.firstName,
        lastName: userDataWithoutRole.lastName,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userRegistrationService.register(userDataWithoutRole as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: userDataWithoutRole.email,
        password: hashedPassword,
        firstName: userDataWithoutRole.firstName,
        lastName: userDataWithoutRole.lastName,
        role: 'user'
      });
      expect(result.role).toBe('user');
    });
  });
});
