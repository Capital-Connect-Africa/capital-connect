import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BASE_URL, BaseHttpService } from "../../../core";
import { CustomQuestion, CustomQuestionResponse, SpecialCriteria, SpecialCriteriaQuestions } from "../../../shared/interfaces/Investor";
import { UserSubmissionResponse } from "../../../shared";
import { Answer, AnswerInput } from "../../questions/interfaces";
import { Company, SpecialCriteriaCompany, SpecialCriteriaCompanyRes } from "../../organization/interfaces";

@Injectable(
  {
    providedIn: 'root'
  }
)

export class SpecialCriteriasService extends BaseHttpService {
  authStateService = inject(AuthStateService);
  token = this.authStateService.authToken;
  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient);
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.token}`
  });


  createSpecialCriteria(request: SpecialCriteria): Observable<unknown> {
    const url = `${BASE_URL}/special-criteria`;
    return this.create(url, request, this.headers) as Observable<unknown>;
  }

  addQuestionsToSpecialCriteria(request: SpecialCriteriaQuestions): Observable<unknown> {
    const url = `${BASE_URL}/special-criteria/add-questions`;
    return this.create(url, request, this.headers) as Observable<unknown>;
  }

  createAnswer(answer: AnswerInput) {
    return this.create(`${BASE_URL}/answers`, answer, this.headers) as Observable<Answer>
  }

  addCustomQuestionsToSpecialCriteria(request: CustomQuestion): Observable<CustomQuestionResponse> {
    const url = `${BASE_URL}/questions/special-criteria`;
    return this.create(url, request, this.headers) as Observable<CustomQuestionResponse>;
  }

 getSpecialCriteriaCompanies(id:number):Observable<SpecialCriteriaCompanyRes>{
  const url = `${BASE_URL}/special-criteria/criteria/${id}`;
  return this.read(url, this.headers) as unknown as Observable<SpecialCriteriaCompanyRes>;
 }


  removeQuestionsFromSpecialCriteria(request: SpecialCriteriaQuestions): Observable<unknown> {
    const url = `${BASE_URL}/special-criteria/remove-questions`;
    return this.create(url, request, this.headers) as Observable<unknown>;
  }

  getSpecialCriteriaById(id: number): Observable<SpecialCriteria> {
    return this.read(`${BASE_URL}/special-criteria/${id}`, this.headers) as unknown as Observable<SpecialCriteria>;
  }

  getQuestions(): Observable<UserSubmissionResponse[]>{
    return this.read(`${BASE_URL}/questions`, this.headers) as unknown as  Observable<UserSubmissionResponse[]>
  }


  // getAllSpecialCriteria(): Observable<SpecialCriteria[]> {
  //   return this.read(`${BASE_URL}/special-criteria`, this.headers) as unknown as Observable<SpecialCriteria[]>;
  // }


  getAllSpecialCriteriaByInvestorProfile(id: number): Observable<SpecialCriteria[]> {
    return this.read(`${BASE_URL}/special-criteria/investor-profile/${id}`, this.headers) as unknown as Observable<SpecialCriteria[]>;
  }


  updateSpecialCriteria(id:number,request: SpecialCriteria): Observable<unknown>{
      const url = `${BASE_URL}/special-criteria`;
      return this.update(url,id,request, this.headers) as Observable<unknown>;
  }

 
  deleteSpecialCriteria(id: number): Observable<unknown> {
    const url = `${BASE_URL}/special-criteria`;
    return this.delete(url,id, this.headers) as Observable<unknown>;
  }

}
