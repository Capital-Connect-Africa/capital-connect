export interface Investor {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: string | null;
    isEmailVerified: boolean;
    emailVerificationToken: string;
    emailVerificationExpires: string;
    hasAcceptedTerms: boolean;
    termsAcceptedAt: string | null;
}

export interface Sector {
    id: number;
    name: string;
    description: string;
}

export interface SubSector {
    id: number;
    name: string;
    description: string;
}

export interface ContactPerson {
    id: number;
    firstName: string;
    lastName: string;
    designation: string;
    emailAddress: string;
    phoneNumber: string;
    primaryContact: boolean;
}

export interface RegistrationStructure {
    id: number;
    title: string,
    description: string
}

export interface UseOfFundsOptions {
    id: number;
    title: string,
    description: string
}


export interface BusinessGrowthStageOptions {
    id: number;
    title: string,
    description: string
}

export interface InvestorTypeOptions {
    name: string,
    value: string,
}

export interface InvestmentStructureOptions {
    id: number;
    title: string,
    description: string
}

export interface EsgFocusAreaOptions {
    id: number;
    title: string,
    description: string
}

export interface SpecialCriteria{
    id:number,
    title: string,
    description: string,
    investorProfileId: number
}

export interface SpecialCriteriaQuestions{
    specialCriteriaId: number,
    questionIds: number[]   
}

export interface CustomQuestion{
    text: string,
    type: string,
    order: number,
    tooltip: string
}

export interface CustomQuestionResponse{
    id:number
}



export interface InvestorProfile {
    id: any;
    userId: number;
    headOfficeLocation: string;
    organizationName: string;
    fundDescription: string;
    emailAddress: string;
    url: string;
    availableFunding: number;
    differentFundingVehicles: string;
    countriesOfInvestmentFocus: string[];
    useOfFunds: string[];
    minimumFunding: number;
    maximumFunding: number;
    noMaximumFunding: boolean;
    businessGrowthStages: string[];
    investorType: string;
    investmentStructures: string[];
    esgFocusAreas: string[];
    registrationStructures: string[];
    investor: Investor;
    sectors: Sector[];
    subSectors: SubSector[];
    contactPersons: ContactPerson[];
}
