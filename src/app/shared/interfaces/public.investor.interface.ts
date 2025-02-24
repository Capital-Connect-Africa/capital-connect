import { Currency } from './currency.enum';

export interface PublicInvestor {
  id: number;
  name: string;
  type: string;
  countries: string[];
  sectors: string[];
  businessGrowthStages: string[];
  investees: string[];
  subSectors: string[];
  website: string;
  contactEmail: string[];
  contactName: string[];
  minFunding: number;
  maxFunding: number;
  currency: Currency;
  fundingVehicle: string;
  useOfFunds: string[];
  investmentStructures: string[];
  esgFocusAreas: string[];
  description: string;
  createdAt: Date;
}

export interface UserSearch {
  id: number;
  sector?: string;
  country?: string;
  subSector?: string;
  targetAmount?: number;
  useOfFunds: string;
  matches: number;
  createdAt: Date; 
}