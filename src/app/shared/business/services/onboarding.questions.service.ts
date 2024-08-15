import { CompanyStateService } from "../../../features/organization/services/company-state.service";
import { GrowthStage } from "../../../features/organization/interfaces";

const company = new CompanyStateService()

export enum ESUBSECTIONS {
  LANDING = 'LANDING', STEP_ONE = 'STEP_ONE', STEP_TWO = 'STEP_TWO', STEP_THREE = 'STEP_THREE'
}
export interface ISECTION {
  ID: number,
  LANDING?: number,
  STEP_ONE: number,
  STEP_TWO: number,
  STEP_THREE: number,
}
export interface Score {
  percentageScore: number, score: number, targetScore: number,
  subSectionName?: string, subSectionId?: number
}

export const INVESTOR_ONBOARDING_SUBSECTION_IDS = {
  ID: 7,
  LANDING: 21,
  STEP_ONE: 22,
  STEP_TWO: 24,
  STEP_THREE: 25,
}

export const INVESTOR_ELIGIBILITY_SUBSECTION_IDS = {

  MATURE: {
    ID: 10,
    LANDING: 199,
    STEP_ONE: 67,
    STEP_TWO: 68,
    STEP_THREE: 69,
  },

  INITIAL_PUBLIC_OFFERING: {
    ID: 10,
    LANDING: 199,
    STEP_ONE: 67,
    STEP_TWO: 68,
    STEP_THREE: 69,
  },

  LIQUIDATION: {
    ID: 11,
    LANDING: null as unknown as number,
    STEP_ONE: 133,
    STEP_TWO: 136,
    STEP_THREE: 137,
  },

  TURNAROUND: {
    ID: 11,
    LANDING: null as unknown as number,
    STEP_ONE: 133,
    STEP_TWO: 136,
    STEP_THREE: 137,
  },

  DISTRESS: {
    ID: 11,
    LANDING: null as unknown as number,
    STEP_ONE: 133,
    STEP_TWO: 136,
    STEP_THREE: 137,
  },

  STARTUP_POST_REVENUE: {
    ID: 1,
    LANDING: 15,
    STEP_ONE: 236,
    STEP_TWO: 237,
    STEP_THREE: 9,
  },

  STARTUP_PRE_REVENUE: {
    ID: 1,
    LANDING: 15,
    STEP_ONE: 232,
    STEP_TWO: 235,
    STEP_THREE: 9,
  },

  STARTUP_DEFAULT: {
    ID: 1,
    LANDING: 15,
    STEP_ONE: 3,
    STEP_TWO: 1,
    STEP_THREE: 9,
  },

  IDEA: {
    ID: 265,
    LANDING: 331,
    STEP_ONE: 332,
    STEP_TWO: 333,
    STEP_THREE: 334,
  },


  EARLY_STAGE: {
    ID: 9,
    LANDING: 34,
    STEP_ONE: 35,
    STEP_TWO: 37,
    STEP_THREE: 36,
  },

  GROWTH_STAGE: {
    ID: 9,
    LANDING: 34,
    STEP_ONE: 35,
    STEP_TWO: 37,
    STEP_THREE: 36,
  }
}

export const INVESTOR_PREPAREDNESS_SUBSECTION_IDS = {
  ID: 4,
  LANDING: 6,
  STEP_ONE: 16,
  STEP_TWO: 17,
  STEP_THREE: 18,
}

export const BUSINESS_INFORMATION_SUBSECTION_IDS = {
  ID: 5,
  LANDING: 11,
  STEP_ONE: 12,
  STEP_TWO: 14,
  STEP_THREE: 13,
  STEP_FOUR: 265
}

export const IMPACT_ASSESMENT_SUBSECTION_IDS = {
  ID: 166,
  LANDING: 298,
  STEP_ONE: 138,
  STEP_TWO: 139,
  STEP_THREE: 140,
}

export const getInvestorEligibilitySubsectionIds = (companyStage: GrowthStage) => {
  switch (companyStage) {
    case GrowthStage.Mature:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.MATURE
    case GrowthStage.EarlyStage:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.EARLY_STAGE
    case GrowthStage.GrowthStage:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.GROWTH_STAGE
    case GrowthStage.Turnaround:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.TURNAROUND
    case GrowthStage.Distress:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.DISTRESS
    case GrowthStage.Liquidation:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.LIQUIDATION
    case GrowthStage.StartUpPreRevenue:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.STARTUP_PRE_REVENUE
    case GrowthStage.StartUpPostRevenue:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.STARTUP_POST_REVENUE
    case GrowthStage.InitialPublicOffering:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.INITIAL_PUBLIC_OFFERING
    case GrowthStage.Idea:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.IDEA
    default:
      return INVESTOR_ELIGIBILITY_SUBSECTION_IDS.STARTUP_DEFAULT
  }
}

export const loadInvestorEligibilityQuestions = () => {
  const stage = company.currentCompany.growthStage;
  return getInvestorEligibilitySubsectionIds(stage);
}