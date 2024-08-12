export interface CreateUserInput {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string;
  agreedToTAC: string;
}

export enum PASSWORD_STRENGTH {
  STRONG = 'Strong',
  WEAK = 'Weak',
  MEDIUM = 'Medium'
}

export enum FORM_TYPE {
  SIGNUP,
  SIGNIN,
  FORGOT_PASSWORD
}

export interface Profile{
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: string;
  mobileNumbers: {isVerified: boolean}[]
}

export enum UserMobileNumbersIssues{
  EMPTY,
  UNVERIFIED,
  VERIFIED
}

export interface ActionBody{
  title: string,
  command: string
  message: string,
  issue: UserMobileNumbersIssues,
}