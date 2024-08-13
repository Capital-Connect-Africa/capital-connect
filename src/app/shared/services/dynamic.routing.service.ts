import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest, of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { SubMissionStateService } from "../business/services/submission-state.service";
import {
  BUSINESS_INFORMATION_SUBSECTION_IDS,
  getInvestorEligibilitySubsectionIds,
  IMPACT_ASSESMENT_SUBSECTION_IDS,
  INVESTOR_ONBOARDING_SUBSECTION_IDS,
  INVESTOR_PREPAREDNESS_SUBSECTION_IDS,
} from "../business/services/onboarding.questions.service";
import { QuestionsService } from "../../features/questions/services/questions/questions.service";
import { CompanyStateService } from "../../features/organization/services/company-state.service";
import { LoadingService } from "../../core";
import { GrowthStage } from "../../features/organization/interfaces";
import { InvestorProfile } from "../interfaces/Investor";
import { InvestorScreensService } from "../../features/investor/services/investor.screens.service";
import { AuthStateService } from "../../features/auth/services/auth-state.service";

@Injectable({
  providedIn: 'root'
})
export class DynamicRoutingService {
  private _submissionStateService = inject(SubMissionStateService);
  private _questionService = inject(QuestionsService);
  private _companyStateService = inject(CompanyStateService)
  private _route = inject(Router)
  private _loadingService = inject(LoadingService)
  investorProfile: InvestorProfile = {} as InvestorProfile;
  
  private _screenService = inject(InvestorScreensService)
  private _authStateService = inject(AuthStateService)

  /**
   * Returns an array of unique numbers from the given array.
   *
   * @param {number[]} numbers - The array of numbers.
   * @return {number[]} An array of unique numbers.
   */
  private _getUniqueNumbers(numbers: number[]): number[] {
    const uniqueNumbersSet = new Set(numbers);
    const uniqueNumbersArray = Array.from(uniqueNumbersSet);
    return uniqueNumbersArray;
  }

  getUserSubmissions() {
    //Get the company growth stage to know type of questions we check in the investor eligibility
    const companyGrowthStage = this._companyStateService.currentCompany.growthStage;


    //We get the subsection IDs of the investor elgibility questions based on the company growth stage
    const INVESTOR_ELIGIBILITY_SUBSECTION_IDS = getInvestorEligibilitySubsectionIds(companyGrowthStage);


    //We get all the responses that a company has made
    const userSubmissions$ = this._submissionStateService.getUserSubmissions();


    //We get all the questions of the business information section
    const questionsOfBusinessInformation$ = this._questionService.getSectionQuestions(BUSINESS_INFORMATION_SUBSECTION_IDS.ID);


    //We get aget all the questions of investor eligibility section
    const questionsOfInvestorEligibilty$ = this._questionService.getSectionQuestions(INVESTOR_ELIGIBILITY_SUBSECTION_IDS.ID);


    //We get all the questions of investor preparedness section
    const questionsOfInvestorPreparedness$ = this._questionService.getSectionQuestions(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.ID);


    //We get all the questions of impact assessment section
    const questionsOfImpactAssesement$ = this._questionService.getSectionQuestions(IMPACT_ASSESMENT_SUBSECTION_IDS.ID);


    const init$ =
      userSubmissions$.pipe(
        switchMap((userSubmissions) => {
          this._loadingService.setLoading(true);
          return combineLatest([questionsOfBusinessInformation$, questionsOfInvestorEligibilty$, questionsOfInvestorPreparedness$, questionsOfImpactAssesement$])
            .pipe(map(([questionsOfBusinessInformation, questionsOfInvestorEligibilty, questionsOfInvestorPreparedness, questionsOfImpactAssesement]) => {


              const userSubmissionQuestionIds = this._getUniqueNumbers(userSubmissions.map(us => us.question.id));


              const missingInvestorEligibilitySubsectionIds = questionsOfInvestorEligibilty.filter(question => !userSubmissionQuestionIds.includes(question.id))
                .map(question => question.subSection.id)


              const step1NotDone = missingInvestorEligibilitySubsectionIds.includes((INVESTOR_ELIGIBILITY_SUBSECTION_IDS).STEP_ONE)


              const step2NotDone = missingInvestorEligibilitySubsectionIds.includes((INVESTOR_ELIGIBILITY_SUBSECTION_IDS).STEP_TWO)


              if (missingInvestorEligibilitySubsectionIds.length > 0) {
                const url = '/business/investor-eligibility'
                if (missingInvestorEligibilitySubsectionIds.includes(INVESTOR_ELIGIBILITY_SUBSECTION_IDS.LANDING)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 1, step: 1 } } })
                } else if (step1NotDone) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 1 } } })
                }
                else if (step2NotDone) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 2 } } })
                }
                else if (missingInvestorEligibilitySubsectionIds.includes(INVESTOR_ELIGIBILITY_SUBSECTION_IDS.STEP_THREE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 3 } } })
                }

                this._route.navigateByUrl(url)
                this._loadingService.setLoading(false)
                return (false)
              }


              const missingInvestorPreparednessSubsectionIds = questionsOfInvestorPreparedness.filter(question => !userSubmissionQuestionIds.includes(question.id))
                .map(question => question.subSection.id)


              if (missingInvestorPreparednessSubsectionIds.length > 0) {
                const url = '/business/investor-preparedness'
                if (missingInvestorPreparednessSubsectionIds.includes(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.LANDING)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 1, step: 1 } } })
                } else if (missingInvestorPreparednessSubsectionIds.includes(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.STEP_ONE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 1 } } })
                }
                else if (missingInvestorPreparednessSubsectionIds.includes(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.STEP_TWO)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 2 } } })
                }
                else if (missingInvestorPreparednessSubsectionIds.includes(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.STEP_THREE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 3 } } })
                }
                this._route.navigateByUrl(url)
                return (false)
              }


              const missingImpactAssessmentSubsectionIds = questionsOfImpactAssesement.filter(question => !userSubmissionQuestionIds.includes(question.id))
                .map(question => question.subSection.id)


              if (missingImpactAssessmentSubsectionIds.length > 0) {
                const url = '/business/impact-assessment'
                if (missingImpactAssessmentSubsectionIds.includes(IMPACT_ASSESMENT_SUBSECTION_IDS.STEP_ONE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 1 } } })
                }
                else if (missingImpactAssessmentSubsectionIds.includes(IMPACT_ASSESMENT_SUBSECTION_IDS.STEP_TWO)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 2 } } })
                }
                else if (missingImpactAssessmentSubsectionIds.includes(IMPACT_ASSESMENT_SUBSECTION_IDS.STEP_THREE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 3 } } })
                }

                this._route.navigateByUrl(url)
                return (false)
              }




              const missingBusinessInfoSubsectionIds = questionsOfBusinessInformation
                .filter(question => !userSubmissionQuestionIds.includes(question.id))
                .map(question => question.subSection.id)


              if (missingBusinessInfoSubsectionIds.length > 0) {
                const url = '/business/financials'
                if (missingBusinessInfoSubsectionIds.includes(BUSINESS_INFORMATION_SUBSECTION_IDS.LANDING)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 1, step: 1 } } })
                } else if (missingBusinessInfoSubsectionIds.includes(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_ONE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 1 } } })
                }
                else if (missingBusinessInfoSubsectionIds.includes(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_TWO)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 2 } } })
                }
                else if (missingBusinessInfoSubsectionIds.includes(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_THREE)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 3 } } })
                }
                else if (missingBusinessInfoSubsectionIds.includes(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_FOUR)) {


                  this._route.navigateByUrl(url, { state: { data: { page: 2, step: 4 } } })
                }
                this._loadingService.setLoading(false)
                this._route.navigateByUrl(url)
                return (false)
              }


              this._route.navigateByUrl('/business')
              this._loadingService.setLoading(false)
              return true;
            }))
        })
      )
    return init$
  }


  getInvestorSubmissions() {
    this._route.navigateByUrl('/investor/onboarding')
    return;
    this._loadingService.setLoading(true)
    const questionsOfInvestorOnboarding$ = this._questionService.getSectionQuestions(INVESTOR_ONBOARDING_SUBSECTION_IDS.ID);
    const userSubmissions$ = this._submissionStateService.getUserSubmissions()
    const init$ = combineLatest([userSubmissions$, questionsOfInvestorOnboarding$]).pipe(map(([userSubmissions, questionsOfInvestorOnboarding]) => {
      const userSubmissionQuestionIds = userSubmissions.map(us => us.question.id);


      const missingInvestorOnboardingIds = questionsOfInvestorOnboarding
        .filter(question => !userSubmissionQuestionIds.includes(question.id))
        .map(question => question.subSection.id);


      if (missingInvestorOnboardingIds.length > 0) {
        const url = '/investor/onboarding'
        if (missingInvestorOnboardingIds.includes(INVESTOR_ONBOARDING_SUBSECTION_IDS.LANDING)) {


          this._route.navigateByUrl(url, { state: { data: { page: 1, step: 1 } } })
        } else if (missingInvestorOnboardingIds.includes(INVESTOR_ONBOARDING_SUBSECTION_IDS.STEP_ONE)) {


          this._route.navigateByUrl(url, { state: { data: { page: 2, step: 1 } } })
        }
        else if (missingInvestorOnboardingIds.includes(INVESTOR_ONBOARDING_SUBSECTION_IDS.STEP_TWO)) {


          this._route.navigateByUrl(url, { state: { data: { page: 2, step: 2 } } })
        }
        else if (missingInvestorOnboardingIds.includes(INVESTOR_ONBOARDING_SUBSECTION_IDS.STEP_THREE)) {


          this._route.navigateByUrl(url, { state: { data: { page: 2, step: 3 } } })
        }


        this._loadingService.setLoading(false)
        return (false)
      }
      this._route.navigateByUrl('/investor')
      this._loadingService.setLoading(false)
      return true
    }))


    return init$


  }






  getInvestorProfile() {
    this._loadingService.setLoading(true);
  
    const investorProfile$ = this._screenService.getInvestorProfileById().pipe(
      map((investorProfile: InvestorProfile) => {
        this.investorProfile = investorProfile;
  
        if (this.investorProfile) {
          this._authStateService.initInvestorProfile(this.investorProfile.id)
          this._route.navigateByUrl('/investor');
          return true;
        } else {
          this._route.navigateByUrl('/investor/onboarding');
          return false;
        }
      })
      ,
      catchError((error: any) => {
        this._route.navigateByUrl('/investor/onboarding');
        return of(false);
      }),
      finalize(() => this._loadingService.setLoading(false))
    );
  
    return investorProfile$;
  }
  
}



