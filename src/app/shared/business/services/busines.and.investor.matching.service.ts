import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Score } from "./onboarding.questions.service";
import {MatchedBusiness, MatchedInvestor} from "../../interfaces";
import { GeneralSummary } from "../../interfaces/submission.interface";

@Injectable({
  providedIn: 'root'
})

export class BusinessAndInvestorMatchingService extends BaseHttpService {
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

  getMatchedInvestors(userId: number) {
    return this.readById(`${BASE_URL}/company/business-matches`, userId).pipe(map(res => {
      return res as MatchedInvestor[]
    }))
  }

  getMatchedBusinesses(investorId: number) {
    return this.readById(`${BASE_URL}/company/invesetor-matches`, investorId).pipe(map(res => {
      return res as  MatchedBusiness[]
    }))
  }

  getOnboardingScores(userId: number): Observable<Score[]> {
    return this.read(`${BASE_URL}/submissions/user/${userId}/score`).pipe((map(res  => {
      // @ts-ignore
      return res.score as Score[];
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

  //Mark company as interesting
  markCompanyAsInteresting(companyId: number): Observable<void> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/interesting/${investorProfileId}/${companyId}`, {}).pipe(
      map(() => void 0)  
    );
  }
  
  //Connect with a company
  connectWithCompany(companyId: number): Observable<void> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.create(`${BASE_URL}/matchmaking/connect/${investorProfileId}/${companyId}`, {}).pipe(
      map(() => void 0)  // Transform response to void
    );
  }

  //Interesting companies
  getInterestingCompanies(): Observable<MatchedBusiness[]> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.read(`${BASE_URL}/matchmaking/interested/${investorProfileId}`).pipe(
      map(res => res as MatchedBusiness[])
    );
  }

  //connected companies
  getConnectedCompanies(): Observable<MatchedBusiness[]> {
    let investorProfileId = Number(sessionStorage.getItem('profileId'))
    return this.read(`${BASE_URL}/matchmaking/connected/${investorProfileId}`).pipe(
      map(res => res as MatchedBusiness[])
    );
  }

  //Interested Investors
  getInterestedInvestors(companyId: number): Observable<any[]> { // Replace any with a proper interface if available
    return this.read(`${BASE_URL}/matchmaking/investors/interested/${companyId}`).pipe(
      map(res => res as any[]) 
    );
  }

  getConnectedInvestors(companyId: number): Observable<any[]> { // Replace any with a proper interface if available
    return this.read(`${BASE_URL}/matchmaking/investors/connected/${companyId}`).pipe(
      map(res => res as any[]) // Replace any[] with the correct type
    );
  }

    
  //Matched Investor Profiles
  getMatchedInvestorProfiles(): Observable<MatchedInvestor[]> {
    return this.read(`${BASE_URL}/matchmaking/investor-profiles`).pipe(
      map(res => res as MatchedInvestor[])
    );
  }


  
}
