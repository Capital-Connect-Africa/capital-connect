import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL, BaseHttpService } from '../../../core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { Company, CompanyInput, CompanyResponse } from '../interfaces';
import { ValuationResponse } from '../pages/valuation/valuation.interface';

@Injectable({providedIn: 'root'})
export class ValuationHttpService extends BaseHttpService {
  constructor(private _httpClient: HttpClient) { super(_httpClient);  }

  getValuticoQuestions(){
    return this.read(`${BASE_URL}/valutico`).pipe(map((res: any) => res as ValuationResponse));
  }

  getValuticoCountries(){
    return this.read(`${BASE_URL}/valutico/Countries?param=kenya`).pipe(map((res: any) => res as unknown));
  }

  getValuticoIndustries(){
    return this.read(`${BASE_URL}/valutico/industries?param=health`).pipe(map((res: any) => res as unknown));
  }

  getValuticoPeers(){
    return this.read(`${BASE_URL}/valutico/peers?param=bolt`).pipe(map((res: any) => res as unknown));
  }

  submitValuationData(data:any){
    return this.create(`${BASE_URL}/valutico/valuations`, data) as any
  }

}
