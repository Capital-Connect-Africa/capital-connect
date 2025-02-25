export interface ValuationQuestion {
  id: string;
  type: string;
  question: string;
  required?: boolean;
  options?: any[];
  placeholder?: string;
  validationRule?: string;
  questions?: ValuationQuestion[];
  value?: any;
  questionText?: string;
  numberFormat?: boolean;
  min?: number;
  max?: number;
  lowRiskName?: string;
  highRiskName?: string;
}

export interface ValuationResponse {
  questions: ValuationQuestion[];
}