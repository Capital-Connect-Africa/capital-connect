import {CompanyStateService} from "../../../features/organization/services/company-state.service";

const company =new CompanyStateService()

export enum COMPANY_STAGES{
  STARTUP, ESTABLISHED_EXPANSION,
  LIQUIDATION_TURNAROUND, GROWTH_STAGE
}

export const INVESTOR_ELIGIBILITY_SUBSECTION_IDS ={

  ESTABLISHED_EXPANSION: {
    LANDING: null as unknown as number,
    STEP_ONE: 67,
    STEP_TWO: 68,
    STEP_THREE: 69,
  },

  LIQUIDATION_TURNAROUND:{
    LANDING: null as unknown as number,
    STEP_ONE: 133,
    STEP_TWO: 136,
    STEP_THREE: 137,
  },

  STARTUP: {
    LANDING: 15,
    STEP_ONE: 3,
    STEP_TWO: 1,
    STEP_THREE: 9,
  },

  GROWTH_STAGE: {
    LANDING: 34,
    STEP_ONE: 35,
    STEP_TWO: 37,
    STEP_THREE: 36,
  }
}

export const INVESTOR_PREPAREDNESS_SUBSECTION_IDS ={
  LANDING: 6,
  STEP_ONE: 16,
  STEP_TWO: 17,
  STEP_THREE: 18,
}

export const BUSINESS_FINANCIALS_SUBSECTION_IDS ={
  LANDING: 11,
  STEP_ONE: 12,
  STEP_TWO: 14,
  STEP_THREE: 13,
}

export const getInvestorEligibilitySubsectionIds =(companyStage:COMPANY_STAGES) =>{
  switch (companyStage){
    case COMPANY_STAGES.ESTABLISHED_EXPANSION:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.ESTABLISHED_EXPANSION
    case COMPANY_STAGES.STARTUP:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.STARTUP
    case COMPANY_STAGES.GROWTH_STAGE:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.GROWTH_STAGE
    case COMPANY_STAGES.LIQUIDATION_TURNAROUND:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.LIQUIDATION_TURNAROUND
    default:
      return null as unknown as COMPANY_STAGES
  }
}

export const loadInvestorEligibilityQuestions =() =>{
  console.log(company.currentCompany)
}
