import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, BaseHttpService } from '../../../core';
import { catchError, EMPTY, forkJoin, map, Observable } from 'rxjs';
import { Company, CompanyInput, CompanyResponse } from '../interfaces';
import { InvestorMatchingQuestions } from '../../business/interfaces/choice.interface';

@Injectable({providedIn: 'root'})
export class CompanyHttpService extends BaseHttpService {
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

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

  getAllCompanies() {
    return this.read(`${BASE_URL}/company?page=1&limit=300`) as Observable<CompanyResponse[]>
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

  fetchQuestionChoices(){
    const requests =[
      this.read(`${BASE_URL}/stages`),
      this.read(`${BASE_URL}/esg-focus`),
      this.read(`${BASE_URL}/use-funds`),
      this.read(`${BASE_URL}/investment-structures`),
      this.read(`${BASE_URL}/registration-structures`),
      this.read(`${BASE_URL}/company/list/no-of-employees`),
      this.read(`${BASE_URL}/company/list/years-of-operation`)
    ]

    return forkJoin(requests).pipe(map(res =>{
        return {
          esg_focus: res[1],
          use_of_funds: res[2],
          stage_of_growth: res[0],
          years_of_operation: res[6],
          number_of_employees: res[5],
          investment_structures: res[3],
          registration_structure: res[4],
        }
    })) as Observable<InvestorMatchingQuestions>
}

}
