import { inject, Injectable } from "@angular/core";
import { BusinessAndInvestorMatchingService } from "../business/services/busines.and.investor.matching.service";
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from "rxjs";
import { AuthStateService } from "../../features/auth/services/auth-state.service";
import {
  BUSINESS_INFORMATION_SUBSECTION_IDS, getInvestorEligibilitySubsectionIds,
  IMPACT_ASSESMENT_SUBSECTION_IDS,
  INVESTOR_ELIGIBILITY_SUBSECTION_IDS,
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

  respondToInvestorConnectionRequest(uuid: string, response: string){
    return this._scoringService.respondToInvestorConnectionRequest(uuid, response).pipe(map(res =>{
      return res;
    }))
  }

  getCompanyStats(){
    return this._scoringService.getCompanyStats(this._companyService.currentCompany.id).pipe(map(res => {
      return res
    }))
  }

  getConnectedInvestors() {
    return this._scoringService.getConnectedInvestors(this._companyService.currentCompany.id).pipe(map((investors: any[]) => {
      return investors.map(investor =>({...investor.investorProfile}));
    })) as Observable<MatchedInvestor[]>
  }

  getInvestorProfile(investorId: number) {
    return this._scoringService.getInvestorProfile(investorId).pipe(map((investor: any) => {
      return investor;
    })) as Observable<MatchedInvestor>
  }

  getConnectionRequests() {
    return this._scoringService.getConnectionRequests(this._companyService.currentCompany.id).pipe(map((investors: any[]) => {
      return investors.map(investor =>({uuid: investor.uuid, ...investor.investorProfile}));
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

  getDecliningInvestors(){
    return this._scoringService.getDecliningInvestors(this._companyService.currentCompany.id).pipe(map((investors:any[]) => {
      return investors.map(investor =>({...investor.investorProfile, declineReasons: investor.declineReasons??[]}));
    }))
  }

  getInvestors(){
    const requests =[this.getMatchedInvestors(), this.getConnectedInvestors(), this.getDecliningInvestors()]
    return forkJoin(requests).pipe(map(res =>({
      matched: res[0],
      connected: res[1],
      declined: res[2],
    })))
  }

  getBusinessInvestorRelations(){
    const reqs =[this.getMatchedInvestors(), this.getConnectedInvestors(), this.getDecliningInvestors(), this.getConnectionRequests()]
    return forkJoin(reqs).pipe(map(res =>{
      const matches =res[0]
      const connections =res[1];
      const declines =res[2];
      const requests = res[3]
      // const requests =res[3].filter(investor =>!matches.find(minvestor =>minvestor.id ==investor.id) && !connections.find(cinvestor =>cinvestor.id ==investor.id) && !declines.find(dinvestor =>dinvestor.id ==investor.id));
      return {
        matches, connections, declines, requests
      }
      }),
    catchError(err =>{
      return EMPTY
    }));
  }

  getSectionProgress(id: number){
    return this._scoringService.getSectionSubmissionProgress(this._authStateService.currentUserId(), id);
  }

  get progress(){
    const requests =[
      this.getSectionProgress(getInvestorEligibilitySubsectionIds(this._companyService.currentCompany.growthStage).ID),
      this.getSectionProgress(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID,),
      this.getSectionProgress(BUSINESS_INFORMATION_SUBSECTION_IDS.ID),
      this.getSectionProgress(IMPACT_ASSESMENT_SUBSECTION_IDS.ID),
      this._scoringService.getCompanyProgress(this._companyService.currentCompany.id),
    ];
    return forkJoin(requests).pipe(map((res:any[]) =>{
      
      return [
        {
          section: 'Investor Eligibility',
          progress: Math.round(res[0].completenessPercentage as number),
        },

        {
          section: 'Investor Preparedness',
          progress: Math.round(res[1].completenessPercentage as number),
        },

        {
          section: 'Business Information',
          progress: Math.round(res[2].completenessPercentage as number),
        },

        {
          section: 'Impact Assement',
          progress: Math.round(res[3].completenessPercentage as number),
        },

        {
          section: 'Business Profile',
          progress: Math.round(res[4].completeness as number),
        }
      ]
    }));
  } 
}
