import {Injectable,inject} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BASE_URL, BaseHttpService } from "../../../core";
import { SpecialCriteria, SpecialCriteriaQuestions } from "../../../shared/interfaces/Investor";

@Injectable(
  {
    providedIn: 'root'
  }
)

export class InvestorScreensService extends BaseHttpService{
  private _currentScreenSRC =new BehaviorSubject<number>(1)
  private _currentStepSRC =new BehaviorSubject<number>(1);

  authStateService = inject(AuthStateService);
  token = this.authStateService.authToken;
  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient);
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.token}`
  });



 //Apis
 createSpecialCriteria(request: SpecialCriteria): Observable<unknown>{
    const url = `${BASE_URL}/special-criteria`;
    return this.create(url, request, this.headers) as Observable<unknown>;
}

addQuestionsTopecialCriteria(request: SpecialCriteriaQuestions): Observable<unknown>{
    const url = `${BASE_URL}/special-criteria/add-questions`;
    return this.create(url, request, this.headers) as Observable<unknown>;
}


removeQuestionsrompecialCriteria(request: SpecialCriteriaQuestions): Observable<unknown>{
    const url = `${BASE_URL}/special-criteria/remove-questions`;
    return this.create(url, request, this.headers) as Observable<unknown>;
}

getSpecialCriteriaById(id:number): Observable<SpecialCriteria>{
    return this.read(`${BASE_URL}/special-criteria/${id}`,this.headers) as unknown as Observable<SpecialCriteria>;
  }


getAllSpecialCriteria(): Observable<SpecialCriteria[]>{
return this.read(`${BASE_URL}/special-criteria`,this.headers) as unknown as Observable<SpecialCriteria[]>;
}


getAllSpecialCriteriaByInvestorProfile(id:number): Observable<SpecialCriteria[]>{
return this.read(`${BASE_URL}/special-criteria/${id}`,this.headers) as unknown as Observable<SpecialCriteria[]>;
}


// //check on this
// updateSpecialCriteria(request: SpecialCriteria): Observable<unknown>{
//     const url = `${BASE_URL}/special-criteria`;
//     return this.PUT(url, request, this.headers) as Observable<unknown>;
// }

// ### Update Special criteria
// PUT http://localhost:3000/special-criteria/2
// Content-Type: application/json
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

// {
//   "title": "New Special Criteria updated",
//   "description": "This is a test criteria updated."
// }

// ### Delete Special criteria by Id
// DELETE http://localhost:3000/special-criteria/3
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9





}
