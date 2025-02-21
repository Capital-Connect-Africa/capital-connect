import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, BaseHttpService } from '../../../core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Company, CompanyInput, CompanyResponse } from '../interfaces';
import { InvestorMatchingQuestions } from '../../business/interfaces/choice.interface';

@Injectable({providedIn: 'root'})
export class ValuationHttpService extends BaseHttpService {
  constructor(private _httpClient: HttpClient) { super(_httpClient);  }

  createCompany(companyInput:CompanyInput) {
    const payload ={...companyInput, useOfFunds: companyInput.useOfFunds.join(','), investmentStructure: companyInput.investmentStructure.join(','), esgFocusAreas: companyInput.esgFocusAreas.join(',')}
    return this.create(`${BASE_URL}/company`, payload) as Observable<CompanyResponse>
  }

  getCompanyOfUser(id:number){
    return this.readById(`${BASE_URL}/company/owner`, id).pipe(map((res:any) =>{
      const payload:CompanyResponse ={...res, useOfFunds: res.useOfFunds.split(','), investmentStructure: res.investmentStructure.split(','), esgFocusAreas: res.esgFocusAreas.split(',')}
      return payload;
    }))  as Observable<CompanyResponse>
  }

  getValuticoQuestions() {
    return this.read(`${BASE_URL}/company?page=1&limit=300`) as Observable<CompanyResponse[]>
  }

  //edit company profile
  updateCompanyProfileVisibility(id:number,value:boolean){
    if(value){
      return this.updatePatchUrl(`${BASE_URL}/company/${id}/hide`)
    }else{
      return this.updatePatchUrl(`${BASE_URL}/company/${id}/unhide`)
    }
  }

  
  searchCompanies(query:string) {
    return this.read(`${BASE_URL}/company/search?query=${query}`) as Observable<CompanyResponse[]>
  }


  getSingleCompany(companyId: number) {
    return this.readById(`${BASE_URL}/company`, companyId) as Observable<CompanyResponse>
  }

  updateCompany(companyId: number, company: Company) {
    const payload ={...company, useOfFunds: company.useOfFunds.join(','), investmentStructure: company.investmentStructure.join(','), esgFocusAreas: company.esgFocusAreas.join(',')}
    return this.updatePatch(`${BASE_URL}/company`, companyId, payload) as Observable<CompanyResponse>
  }

  deleteCompany(companyId: number) {
    return this.delete(`${BASE_URL}/company`, companyId) as Observable<unknown>
  }

  fetchCompanyYearsOfOperation(){
    return this.read(`${BASE_URL}/company/list/years-of-operation`).pipe(map(res =>{
      return res
    }), catchError(err =>{
      return EMPTY
    }));
  }

  fetchCompanyNumberOfEmployees(){
    return this.read(`${BASE_URL}/company/list/no-of-employees`).pipe(map(res =>{
      return res
    }), catchError(err =>{
      return EMPTY
    }));
  }

  fetchRegistrationStructure(){
    return this.read(`${BASE_URL}/registration-structures`).pipe(map(res =>{
      return res
    }), catchError(err =>{
      return EMPTY
    }));
  }

  fetchGrowthStages(){
    return this.read(`${BASE_URL}/stages`).pipe(map(res =>{
      return res
    }), catchError(err =>{
      return EMPTY
    }));
  }


}
