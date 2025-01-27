export interface CreateUserInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string;
  referralToken?: string;
  hasAcceptedTerms: string;
  hasAcceptedPrivacyPolicy: string;
}

export enum PASSWORD_STRENGTH {
  STRONG = 'Strong',
  WEAK = 'Weak',
  MEDIUM = 'Medium',
}

export enum FORM_TYPE {
  SIGNUP,
  SIGNIN,
  FORGOT_PASSWORD,
}

export interface MobileNumber {
  phoneNo: string;
  isVerified: boolean;
}

export interface Profile {
  id: number;
  roles: string;
  lastName: string;
  username: string;
  firstName: string;
  referralCode: string;
  hasAcceptedTerms: boolean;
  mobileNumbers: MobileNumber[];
}

export enum UserMobileNumbersIssues {
  EMPTY,
  UNVERIFIED,
  VERIFIED,
}

export interface ActionBody {
  title: string;
  command: string;
  message: string;
  issue: UserMobileNumbersIssues;
}
