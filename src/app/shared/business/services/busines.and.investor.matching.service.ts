import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Score } from "./onboarding.questions.service";
import {MatchedBusiness, MatchedInvestor,InterestingBusinesses,ConnectedBusiness, MatchMakingStats} from "../../interfaces";
import { GeneralSummary, UserSubmissionResponse } from "../../interfaces/submission.interface";
import { Submission } from "../../interfaces/submission.interface";
import { Company } from "../../../features/organization/interfaces";
// import { ConfirmationService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})

export class BusinessAndInvestorMatchingService extends BaseHttpService {
  // private _confirmationService = inject(ConfirmationService);
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

  getMatchedInvestors() {
    return this.read(`${BASE_URL}/matchmaking/investor-profiles`).pipe(map(res => {
      return res as MatchedInvestor[]
    }))
  }
  
  getConnectedInvestors(companyId: number) {
    return this.read(`${BASE_URL}/matchmaking/investors/connected/${companyId}`).pipe(map(res => {
      return res as MatchedInvestor[]
    }))
  }

  getOnboardingScores(userId: number): Observable<Score[]> {
    return this.read(`${BASE_URL}/submissions/user/${userId}/score`).pipe((map(res  => {
      // @ts-ignore
      return res.score as Score[];
    })))
  }

  getSubmisionByIds(userId: number,questionIds: number[]) : Observable<UserSubmissionResponse[]>{
    return this.read(`${BASE_URL}/submissions/by-question-ids?questionIds=${questionIds}&userId=${userId}`).pipe((map(res=>{
      return res as UserSubmissionResponse[];
    })))

  }

  getSectionScore(userId: number, sectionId: number): Observable<Score> {
    return this.read(`${BASE_URL}/submissions/user/${userId}/score/${sectionId}`).pipe((map(res => {
      return res;
    }))) as unknown as Observable<Score>
  }

  getGeneralSummary(score: number, type: string): Observable<GeneralSummary> {
    return this.read(`${BASE_URL}/scorings/score/${score}?type=${type}`).pipe((map(res => {
      return res;
    }))) as unknown as Observable<GeneralSummary>
  }

  //Matched companies
  getMatchedCompanies(): Observable<MatchedBusiness[]> {
    return this.read(`${BASE_URL}/matchmaking/companies`).pipe(
      map(res => res as MatchedBusiness[])
    );
  }

  getMatchMakingStatistics(): Observable<MatchMakingStats>{
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.read(`${BASE_URL}/statistics/matchmaking/${investorProfileId}`).pipe(
      map(res => res as unknown as MatchMakingStats)
    )
  }

  //Mark company as interesting
  markCompanyAsInteresting(companyId: number): Observable<void> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/interesting/${investorProfileId}/${companyId}`, {}).pipe(
      map(() => void 0)  
    );
  }

  //Search criteria
  postSearchCriteria(criteria: Company):Observable<MatchedBusiness[]>{
    return this.create(`${BASE_URL}/matchmaking/search-companies`, criteria).pipe(
      map((res) => res as unknown as MatchedBusiness[])  
    );
  }


  //reasons for rejecting   
  getDeclineReasons(): Observable<String[]>{
    return this.read(`${BASE_URL}/decline-reasons`).pipe(
      map(res => res as unknown as String[])
    )
  }
  
  //Connect with a company
  connectWithCompany(companyId: number): Observable<void> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/connect/${investorProfileId}/${companyId}`, {}).pipe(
      map(() => void 0) 
    );
  }


  //Cancel Connection with a company
  cancelConnectWithCompany(companyId: number,reasons: string[]): Observable<void> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/disconnect/${investorProfileId}/${companyId}`, reasons).pipe(
      map(() => void 0)  
    );
  }

   //Cancel Connection with a company
   cancelInterestWithCompany(companyId: number, reasons: string[]): Observable<void> {    
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/decline/${investorProfileId}/${companyId}`, reasons).pipe(
      map(() => void 0)  
    );
  }


  //Interesting companies
  getInterestingCompanies(page:number, limit:number): Observable<InterestingBusinesses[]> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    // return this.read(`${BASE_URL}/matchmaking/interested/${investorProfileId}?limit=${limit}`).pipe(
    //   map(res => res as InterestingBusinesses[])
    // );

    return this.read(`${BASE_URL}/matchmaking/interested/${investorProfileId}?page=${page}&limit=${limit}`).pipe(
      map(res => res as InterestingBusinesses[])
    );
  }

  //connected companies
  getConnectedCompanies(page:number, limit:number): Observable<ConnectedBusiness[]> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))

    return this.read(`${BASE_URL}/matchmaking/connected/${investorProfileId}?page=${page}&limit=${limit}`).pipe(
      map(res => res as ConnectedBusiness[])
    );
  }

  //Rejected companies
  getRejectedCompanies(page:number, limit:number): Observable<ConnectedBusiness[]> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.read(`${BASE_URL}/matchmaking/declined/${investorProfileId}?page=${page}&limit=${limit}`).pipe(
      map(res => res as ConnectedBusiness[])
    );
  }

    
  //Matched Investor Profiles
  getMatchedInvestorProfiles(): Observable<MatchedInvestor[]> {
    return this.read(`${BASE_URL}/matchmaking/investor-profiles`).pipe(
      map(res => res as MatchedInvestor[])
    );
  }


  
}
