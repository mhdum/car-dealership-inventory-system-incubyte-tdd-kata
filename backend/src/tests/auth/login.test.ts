const { loginUser } = require('../../../src/services/UserLoginService');
const { findUserByEmail } = require('../../../src/repositories/UserRepository');
const { verifyPassword } = require('../../../src/common/utils/HashPassword'); 
const { generateToken } = require('../../../src/common/utils/JwtToken'); 

jest.mock('../../../src/repositories/UserRepository');
jest.mock('../../../src/common/utils/HashPassword');
jest.mock('../../../src/common/utils/JwtToken');

describe('UserLoginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    const loginCredentials = {
      email: 'sales@dealership.com',
      password: 'SecurePass123'
    };

    const mockHashedPassword = 'someHashedPassword';
    const existingUser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Sales',
      email: 'sales@dealership.com',
      phone: '1234567890',
      password: mockHashedPassword,
      role: 'sales',
      status: 'active'
    };

    const mockToken = 'mocked_jwt_token_string';

    it('should login user successfully and return a token with user data', async () => {
      // Setup: user is found, password matches, token generates smoothly
      findUserByEmail.mockResolvedValue(existingUser);
      verifyPassword.mockResolvedValue(true);
      generateToken.mockReturnValue(mockToken);

      const result = await loginUser(loginCredentials);

      // Asserts your four conditions implicitly and explicitly
      expect(result).toHaveProperty('token');
      expect(result.token).toBe(mockToken);
      expect(result.user).toHaveProperty('_id');
      expect(result.user.email).toBe(loginCredentials.email);
      expect(result.user).not.toHaveProperty('password'); // Clean exposure check

      // Verifies inputs are correctly normalized
      expect(findUserByEmail).toHaveBeenCalledWith(loginCredentials.email.toLowerCase());
      expect(verifyPassword).toHaveBeenCalledWith(loginCredentials.password, mockHashedPassword);
      expect(generateToken).toHaveBeenCalledWith(expect.objectContaining({ 
        id: existingUser._id, 
        role: existingUser.role 
      }));
    });

    it('should reject login if user is unknown', async () => {
      // Setup: DB search returns null
      findUserByEmail.mockResolvedValue(null);

      await expect(loginUser(loginCredentials))
        .rejects
        .toThrow('Invalid email or password');

      expect(findUserByEmail).toHaveBeenCalledWith(loginCredentials.email.toLowerCase());
      expect(verifyPassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    it('should reject login if password is wrong', async () => {
      // Setup: user found, but password verification fails
      findUserByEmail.mockResolvedValue(existingUser);
      verifyPassword.mockResolvedValue(false);

      await expect(loginUser(loginCredentials))
        .rejects
        .toThrow('Invalid email or password');

      expect(verifyPassword).toHaveBeenCalledWith(loginCredentials.password, mockHashedPassword);
      expect(generateToken).not.toHaveBeenCalled();
    });

    it('should propagate repository errors safely', async () => {
      const repositoryError = new Error('Database connection failed');
      findUserByEmail.mockRejectedValue(repositoryError);

      await expect(loginUser(loginCredentials))
        .rejects
        .toThrow('Database connection failed');

      expect(verifyPassword).not.toHaveBeenCalled();
    });

    it('should propagate token generation errors safely', async () => {
      const jwtError = new Error('Token signing failed');
      
      findUserByEmail.mockResolvedValue(existingUser);
      verifyPassword.mockResolvedValue(true);
      generateToken.mockImplementation(() => { throw jwtError; });

      await expect(loginUser(loginCredentials))
        .rejects
        .toThrow('Token signing failed');
    });
  });
});