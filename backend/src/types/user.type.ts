import type { UserRole, UserStatus } from '../common/config/constants';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole; // Now successfully resolved as a type
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

export interface UserResponse {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
