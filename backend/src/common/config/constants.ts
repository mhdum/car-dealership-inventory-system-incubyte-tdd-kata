// src/constants/userConstants.ts

const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
} as const;

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
} as const;

const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MIN_LENGTH: 2,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50
} as const;

const BCRYPT = {
  SALT_ROUNDS: 10
} as const;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

module.exports = {
  USER_ROLES,
  USER_STATUS,
  VALIDATION,
  BCRYPT,
  HTTP_STATUS
};
