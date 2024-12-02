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
  value: number
}


export interface OpexRecords {
  id: number,
  description: string,
  value: number
}

export interface FinancialInfoRecords {
  id: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  notes: string | null;
  revenues: RevenueRecords[];
  opex: OpexRecords[];
  company: {
    id: number;
  };
  user: {
    username: string;
  };
}


export interface UpdateFinancialRecords {
  id: number,
  year: number, 
  status: string,
  notes: string | null, 
  revenues: number[],
  opex: number[],
  companyId: number
}
