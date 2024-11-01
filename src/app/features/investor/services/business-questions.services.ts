import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BASE_URL, BaseHttpService } from "../../../core";
import { CustomQuestion, CustomQuestionResponse, SpecialCriteria, SpecialCriteriaQuestions } from "../../../shared/interfaces/Investor";
import { UserSubmissionResponse } from "../../../shared";
import { Answer, AnswerInput, Question } from "../../questions/interfaces";


@Injectable(
  {
    providedIn: 'root'
  }
)

export class BusinessQuestionsService extends BaseHttpService {
  authStateService = inject(AuthStateService);
  token = this.authStateService.authToken;
  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient);
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.token}`
  });

  //Business Questions
 getBusinessQuestions(id:number):Observable<Question[]>{
  const url = `${BASE_URL}/subsections/${id}/questions`;
  return this.read(url, this.headers) as unknown as Observable<Question[]>;
 }

}
