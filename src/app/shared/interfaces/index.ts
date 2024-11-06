import { InvestorProfile } from "./Investor"

export interface MatchedBusiness {
fundsNeeded: any;
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
  fullTimeBusiness: boolean,
  declineReasons: String[],

  //missing 
  ImpactElements: [],
  useOfFunds: [],
  InvestmentStructure : string,
  EligibilityScore: string,
  PreparednessScore: string,
  ImpactAssesment : string, //connected

}

export interface DeclineReasons{
    id: number,
    declineRole: string,
    reason: string
}

export interface ConnectionRequest{
  id: number;
  uuid: string;
  isApproved: boolean | null;
  createdAt: string;
  updatedAt: string;
  company: MatchedBusiness;
}

export interface ConnectionRequestBody{
  investorProfileId: number,
  companyId:number
}

export interface updateConnectionRequestBody{
  investorProfileId: number,
  companyId:number,
  isApproved: boolean | null
}


export interface MatchMakingStats{
  requested: number;
  interesting: number,
  declined: number,
  connected: number
}

export interface ConnectionRequestsStats{
  requested:number,
  approved:number,
  declined:number
}


export interface MatchedInvestor {
  id: number,
  uuid: string,
  matched: number,
  connected: number,
  declined: number,
  interested: number,
  investorType: string,
  useOfFunds: string[],
  emailAddress: string,
  minimumFunding: number,
  maximumFunding: number,
  esgFocusAreas: string[],
  organizationName: string,
  sectors:{name: string}[],
  subSectors:{name: string}[],
  noMaximumFunding: boolean,
  headOfficeLocation: string,
  businessGrowthStages: string[],
  investmentStructures: string[],
  registrationStructures: string[],
  countriesOfInvestmentFocus: string[],
  availableFunding: number,
  specialCriteria: any[],
  declineReasons:string[],
  investor: {
    lastName: string,
    username: string,
    firstName: string,
  }
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

export interface BusinessProfile{
   company: {
    name: string,
    businessSector: string,
    growthStage: string,
   }
   declineReasons: string[],
}