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
    return this.read(`${BASE_URL}/matchmaking/investor-profiles`).pipe(map(res => {
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
}
