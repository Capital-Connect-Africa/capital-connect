export interface SectionInput {
  name: string;
  description: string;
}

export interface SubSectionInput {
  name: string;
  description: string;
  sectionId: number;
}

export interface QuestionInput {
  text: string;
  subSectionId: number;
  type: QuestionType;
}


export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE'
}

export interface Section {
  id: number;
  name: string;
  description: string;
}

export interface Question {
  text: string;
  type: QuestionType;
  tooltip: string,
  order: number;
  subSection: {
    id: number;
  }
  id: number;
  answers: Answer[],
  submissionId?: number,
  defaultValues?: { answerId: number, text?: string, submissionId?: number }[]
}

export interface SubSection {
  id: number;
  name: string;
  description: string;
  sectionId?: number;
  section?: { id: number }
}

export interface Answer {
  text: string;
  weight: number;
  id: number;
  submissionId?: number,
  recommendation?: string,
  order?: number;
  question: {
    id: number
  }
}
export interface AnswerInput {
  text: string;
  weight: number;
  questionId: number;
}


export interface CurrentDashboardInput {
  sectionId: number;
  subsectionId: number;
  questionId: number;
}

export interface RESPONSE_NODE {
  title: string,
  children?: RESPONSE_NODE[]
}




export interface RevenueRecords {
  id: number,
  description: string,
  value: number,
  year: number
}


export interface OpexRecords {
  id: number,
  description: string,
  value: number,
  year: number
}


export interface OpexRecordsPayload {
  description: string,
  value: number,
  year: number,
  companyId: number
}

export interface BalanceSheetRecordPayload {
  companyId: number,
  year: number,
  landProperty: number,
  plantEquipment: number,
  otherNonCurrentAssets: number,
  tradeReceivables: number,
  cash: number,
  inventory: number,
  otherCurrentAssets: number,
  tradePayables: number,
  otherCurrentLiabilities: number,
  loans: number,
  capital: number,
  otherNonCurrentLiabilities: number
}


export interface BalanceSheetRecord{
  id:number
  year: number,
  landProperty: number,
  plantEquipment: number,
  otherNonCurrentAssets: number,
  tradeReceivables: number,
  cash: number,
  inventory: number,
  otherCurrentAssets: number,
  tradePayables: number,
  otherCurrentLiabilities: number,
  loans: number,
  capital: number,
  otherNonCurrentLiabilities: number,
  totalAssets: number,
  totalLiabilities: number,
  netProfit:number
}

export interface CashFlowRecords {
  id: number;
  year: number;
  companyId: number;
  profitBeforeTax: number;
  depreciationAmortisation: number;
  taxesPaid: number;
  operatingCashFlow: number;
  changeInReceivables: number;
  changeInPayables: number;
  netCashFromOperations: number;
  propertyPlantEquipment: number;
  netCashFromInvesting: number;
  movementInBorrowings: number;
  changeInEquity: number;
  netCashFromFinancing: number;
  netCashFlow: number;
  openingCash: number;
  endingCash: number;
}

export interface CashFlowRecordsPayload { 
  year: number;
  companyId: number;
}


export interface FinancialInfoRecords {
  amorDep: string,
  interests: string,
  taxes: string,
  costOfSales: RevenueRecords[]
  id: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  ebitda: string,
  ebit: string,
  notes: string | null;
  revenues: RevenueRecords[];
  opex: OpexRecords[];
  totalRevenues: string | null,
  totalCosts: string | null,
  grossProfit: string | null,
  profitBeforeTax: string | null,
  netProfit: string | null,
  grossMargin: string | null,
  ebitdaMargin: string | null,

  company: {
    id: number;
  };
  user: {
    username: string;
  };
}


export interface FinancialInfoRecordsPayload {
  companyId: number,
  year: number,
  revenues: number[],
  opex: number[],
  costOfSales: number[],
  amorDep: number,
  interests: number,
  taxes: number
}


export interface UpdateFinancialRecords {
  id: number,
  year: number,
  status: string,
  notes: string | null,
  revenues: number[],
  opex: number[],
  companyId: number,
  interests: number,
  amorDep: number,
  costOfSales: [],
  taxes: number,
}

export interface AddNotesToFinancialecords {
  notes: string | null,
}
