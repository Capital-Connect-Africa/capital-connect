import { InvestorProfile } from "./Investor"

export interface MatchedBusiness {
  id: number
  country: string,
  businessSector: string,
  growthStage: string
  name: string, //connected
  businessSubsector: string,
  productsAndServices: string, //connected
  registrationStructure: string, //interesting
  yearsOfOperation: string, //Interesting
  numberOfEmployees: string,
  fullTimeBusiness: boolean

  //missing 
  ImpactElements: [],
  UseOfFunds: [],
  InvestmentStructure : string,
  EligibilityScore: string,
  PreparednessScore: string,
  ImpactAssesment : string, //connected

}

export interface MatchMakingStats{
  interesting: number,
  declined: number,
  connected: number
}

export interface MatchedInvestor {
  headOfficeLocation: string,
  minimumFunding: number,
  maximumFunding: number,
  investorType: string,
  noMaximumFunding: boolean,
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