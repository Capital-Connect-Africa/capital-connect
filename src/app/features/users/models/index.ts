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
  subscriptions: Subscription[];
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  INVESTOR = 'investor',
  ADVISOR = 'advisor'
}

export interface SubscriptionTier {
  id: number;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
}

export interface Subscription {
  id: number;
  subscriptionDate: string;
  expiryDate: string;
  isActive: boolean;
  updatedAt: string;
  subscriptionTier: SubscriptionTier;
}