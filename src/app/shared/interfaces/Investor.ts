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
    investorProfileId: number,
    questions: SpecialCriteriaQuestion[]
}

export interface SpecialCriteriaQuestion {
    id: number;
    text: string;
    type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" |  "TRUE_FALSE" | "SHORT_ANSWER",
    order: number;
    tooltip: string | null;
    answers: Answer[];
  }

export interface Answer {
id: number;
text: string;
recommendation: string | null;
weight: number;
}

export interface SpecialCriteriaQuestions{
    specialCriteriaId: number,
    questionIds: number[]   
}

export interface CustomQuestion{
    id: number,
    text: string,
    type: string,
    order: number,
    tooltip: string
}

export interface CustomQuestionResponse{
    id:number
    text: string,
    type: string,
    order: number,
    tooltip: string,
    // "subSection": {
    //     "id": 397
    // },
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
