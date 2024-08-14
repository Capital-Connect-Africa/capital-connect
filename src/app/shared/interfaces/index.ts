import { InvestorProfile } from "./Investor"
export interface MatchedBusiness {
  id: number
  country: string,
  businessSector: string,
  growthStage: string
  name: string,
  businessSubsector: string,
  productsAndServices: string,
  registrationStructure: string,
  yearsOfOperation: string,
  numberOfEmployees: string,
  fullTimeBusiness: boolean
}

export interface MatchedInvestor {
  name: string
}


export interface InterestingBusinesses {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: MatchedBusiness;
  investorProfile: InvestorProfile;
}

export interface ConnectedBusiness{
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: MatchedBusiness;
  investorProfile: InvestorProfile;
}