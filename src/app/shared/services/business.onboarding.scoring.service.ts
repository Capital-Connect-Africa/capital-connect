import { inject, Injectable } from "@angular/core";
import { BusinessAndInvestorMatchingService } from "../business/services/busines.and.investor.matching.service";
import { forkJoin, map, Observable } from "rxjs";
import { AuthStateService } from "../../features/auth/services/auth-state.service";
import {
  BUSINESS_INFORMATION_SUBSECTION_IDS, getInvestorEligibilitySubsectionIds,
  IMPACT_ASSESMENT_SUBSECTION_IDS,
  INVESTOR_PREPAREDNESS_SUBSECTION_IDS
} from "../business/services/onboarding.questions.service";
import { CompanyStateService } from "../../features/organization/services/company-state.service";
import { MatchedInvestor } from "../interfaces";
import { GrowthStage } from "../../features/organization/interfaces";

@Injectable({
  providedIn: 'root'
})

export class BusinessOnboardingScoringService {
  private _authStateService = inject(AuthStateService);
  private _scoringService = inject(BusinessAndInvestorMatchingService)
  private _companyService = inject(CompanyStateService)
  private _userId = this._authStateService.currentUserId() && this._authStateService.currentUserId() > 0 ? this._authStateService.currentUserId() : Number(sessionStorage.getItem('userId'));
  getOnboardingScores(companyGrowthStage?: GrowthStage, userId = this._userId) {
    const INVESTOR_ELIGIBILITY = getInvestorEligibilitySubsectionIds(companyGrowthStage ?? this._companyService.currentCompany.growthStage);

    return this._scoringService.getOnboardingScores(userId).pipe(map(scores => {

      const businessFinancialsKeys = [...Object.values(BUSINESS_INFORMATION_SUBSECTION_IDS)].filter(key => key !== BUSINESS_INFORMATION_SUBSECTION_IDS.ID);
      const investorEligibilityKeys = [...Object.values(INVESTOR_ELIGIBILITY)].filter(key => key !== INVESTOR_ELIGIBILITY.ID);
      const investorPreparednessKeys = [...Object.values(INVESTOR_PREPAREDNESS_SUBSECTION_IDS)].filter(key => key !== INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID);
      const impactAssessmentKeys = [...Object.values(IMPACT_ASSESMENT_SUBSECTION_IDS)].filter(key => key !== IMPACT_ASSESMENT_SUBSECTION_IDS.ID)

      const businessFinancialScore = scores.filter((score) => businessFinancialsKeys.indexOf(score.subSectionId ?? -1) > -1).map(score => score.percentageScore)
      const investorEligibilityScore = scores.filter((score) => investorEligibilityKeys.indexOf(score.subSectionId ?? -1) > -1).map(score => score.percentageScore)
      const investorPreparednessScore = scores.filter((score) => investorPreparednessKeys.indexOf(score.subSectionId ?? -1) > -1).map(score => score.percentageScore)
      const impactAssessmentScore = scores.filter((score) => impactAssessmentKeys.indexOf(score.subSectionId ?? -1) > -1).map(score => score.percentageScore)


      return {
        businessFinancials: Number(Math.ceil(businessFinancialScore.reduce((prev, acc) => prev + acc, 0) / businessFinancialScore.length)).toFixed(1),
        investorEligibility: Number(Math.ceil(investorEligibilityScore.reduce((prev, acc) => prev + acc, 0) / investorEligibilityScore.length)).toFixed(1),
        investorPreparedness: Number(Math.ceil(investorPreparednessScore.reduce((prev, acc) => prev + acc, 0) / investorPreparednessScore.length)).toFixed(1),
        impactAssessment: Number(Math.ceil(impactAssessmentScore.reduce((prev, acc) => prev + acc, 0) / impactAssessmentScore.length)).toFixed(1),
      }
    }))
  }
  getMatchedInvestors() {
    return this._scoringService.getMatchedInvestors().pipe(map((investors: MatchedInvestor[]) => {
      return investors
    }))
  }

  getConnectedInvestors() {
    return this._scoringService.getConnectedInvestors(this._companyService.currentCompany.id).pipe(map((investors: any[]) => {
      return investors.map(investor =>investor.investorProfile)
    })) as Observable<MatchedInvestor[]>
  }
  getSectionScore(sectionId: number) {
    return this._scoringService.getSectionScore(this._userId, sectionId).pipe(map(score => {
      return Number(score.percentageScore).toFixed(1);
    }))
  }

  getGeneralSummary(score: number, type: string) {
    return this._scoringService.getGeneralSummary(score, type).pipe(map(generalSummary => {
      return generalSummary
    }))
  }


  getInvestors(){
    const requests =[this.getMatchedInvestors(), this.getConnectedInvestors()]
    return forkJoin(requests).pipe(map(res =>({
      matched: res[0],
      connected: res[1]
    })))
  }

}
