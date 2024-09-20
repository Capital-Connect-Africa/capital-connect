export interface User {
  id: number;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles: Role;
  name?: string,
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  isEmailVerified: boolean;
  emailVerificationToken: string;
  emailVerificationExpires: string;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  INVESTOR = 'investor',
  ADVISOR = 'advisor'
}