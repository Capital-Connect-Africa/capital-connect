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

export interface MatchedInvestor {
  id: number,
  investorType: string,
  emailAddress: string,
  minimumFunding: number,
  maximumFunding: number,
  esgFocusAreas: string[],
  organizationName: string,
  sectors:{name: string}[],
  noMaximumFunding: boolean,
  headOfficeLocation: string,
  businessGrowthStages: string[],
  investmentStructures: string[],
  registrationStructures: string[],
  countriesOfInvestmentFocus: string[]
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