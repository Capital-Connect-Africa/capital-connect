import {Injectable,inject} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import { AuthStateService } from "../../auth/services/auth-state.service";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BASE_URL, BaseHttpService } from "../../../core";
import { Investor,RegistrationStructure, InvestorProfile,Sector,SubSector,ContactPerson,
  EsgFocusAreaOptions,InvestmentStructureOptions,InvestorTypeOptions,BusinessGrowthStageOptions, UseOfFundsOptions
} from "../../../shared/interfaces/Investor";

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

  currentScreen$ =this._currentScreenSRC.asObservable();
  currentStep$ =this._currentStepSRC.asObservable();

  setCurrentScreen(screen: number) {
    this._currentScreenSRC.next(screen);
  }

  setCurrentStep(step: number){
    this._currentStepSRC.next(step);
  }


  //Apis
  createInvestorProfile(request: InvestorProfile): Observable<unknown>{
    const url = `${BASE_URL}/investor-profiles`;
    return this.create(url, request, this.headers) as Observable<unknown>;
  }

  // PUT http://localhost:3000/investor-profiles/1
  updateInvestorProfile(request: InvestorProfile,id:number): Observable<unknown>{
    const url = `${BASE_URL}/investor-profiles`;
    return this.update(url,id, request, this.headers) as Observable<unknown>;
  }

  //Contact Person
  createContactPerson(request: ContactPerson): Observable<unknown>{
    const url = `${BASE_URL}/contact-persons`;
    return this.create(url, request, this.headers) as Observable<unknown>;
  }

  grantAccess(investorProfileId:number, contactPersonId:number): Observable<any>{
    return this.create(`${BASE_URL}/contact-persons/grant-access`, {investorProfileId, contactPersonId}, this.headers) as Observable<unknown>;
  }

  //  Get Registration structures prod
  getRegistrationStructures(): Observable<RegistrationStructure[]> {
    return this.read(`${BASE_URL}/registration-structures`, this.headers) as unknown as Observable<RegistrationStructure[]>;
  }


  // // # Get ESG focus areas prod
  getEsgFocusAreas(): Observable<EsgFocusAreaOptions[]> {
    return this.read(`${BASE_URL}/esg-focus`, this.headers) as unknown as Observable<EsgFocusAreaOptions[]>;
  }

  // //Investment structures
  getInvestmentStructures(): Observable<InvestmentStructureOptions[]> {
    return this.read(`${BASE_URL}/investment-structures`, this.headers) as unknown as Observable<InvestmentStructureOptions[]>;
  }


  // // Get Use of funds prod
  getUseOfFunds(): Observable<UseOfFundsOptions[]> {
    return this.read(`${BASE_URL}/use-funds`, this.headers) as unknown as Observable<UseOfFundsOptions[]>;
  }

  // //Get Stages
  getStages(): Observable<BusinessGrowthStageOptions[]> {
    return this.read(`${BASE_URL}/stages`, this.headers) as unknown as Observable<BusinessGrowthStageOptions[]>;
  }

  //Get Investor Types
  getInvestorTypes(): Observable<InvestorTypeOptions[]> {
    return this.read(`${BASE_URL}/investor-types`, this.headers) as unknown as Observable<InvestorTypeOptions[]>;
  }

  //get Investor Profile By Id
  // getInvestorProfileById(): Observable<InvestorProfile>{
  //   const userId = sessionStorage.getItem('userId')
  //   const id = Number(userId)

  //   const contactPerson = JSON.parse(sessionStorage.getItem('contact_person'));

  //   if(contactPerson){
  //     return this.read(`${BASE_URL}/investor-profiles/contacts/${id}`,this.headers) as unknown as Observable<InvestorProfile>;
  //   }
  //   return this.read(`${BASE_URL}/investor-profiles/by-user/${id}`,this.headers) as unknown as Observable<InvestorProfile>;
  // }

  getInvestorProfileById(): Observable<InvestorProfile> {
    const userId = sessionStorage.getItem('userId');
    const id = Number(userId);
  
    // Check if 'contact_person' exists and is a valid JSON string
    const contactPerson = sessionStorage.getItem('contact_person');
    const isContactPerson = contactPerson ? JSON.parse(contactPerson) : false;
  
    if (isContactPerson) {
      return this.read(`${BASE_URL}/investor-profiles/contacts/${id}`, this.headers) as unknown as Observable<InvestorProfile>;
    }
    return this.read(`${BASE_URL}/investor-profiles/by-user/${id}`, this.headers) as unknown as Observable<InvestorProfile>;
  }
  


  getInvestorProfileByContactPersonId(): Observable<InvestorProfile>{
    const userId = sessionStorage.getItem('userId')
    const id = Number(userId)

    // GET https://capitalconnect-0060e0fb0eb4.herokuapp.com/investor-profiles/contacts/1132
    return this.read(`${BASE_URL}/investor-profiles/contacts/${id}`,this.headers) as unknown as Observable<InvestorProfile>;
  }
}
