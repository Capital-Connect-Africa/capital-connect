import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../http/base/base.http.service';
import { map } from 'rxjs';
import { BulkCreateResponse, PublicInvestor, UserSearch } from '../../../shared/interfaces/public.investor.interface';
import { BASE_URL } from '../../http/base/constants';

@Injectable({
  providedIn: 'root'
})
export class PublicInvestorsRepositoryService extends BaseHttpService{

  getInvestors(){
    return this.read(`${BASE_URL}/investors-repository`).pipe(map(res =>{
      return res as PublicInvestor[]
    }))
  }

  getInvestor(investorId: number){
    return this.readById(`${BASE_URL}/investors-repository`, investorId).pipe(map(res =>{
      return res as PublicInvestor
    }))
  }

  createInvestor(payload: Partial<PublicInvestor>){
    return this.create(`${BASE_URL}/investors-repository`, payload).pipe(map(res =>{
      return res as PublicInvestor
    }))
  }

  uploadInvestorsFile(file:File){
    return this.create(`${BASE_URL}/investors-repository/upload`, file).pipe(map(res =>{
      return res as PublicInvestor[]
    }))
  }

  updateInvestor(payload:Partial<PublicInvestor>, investorId:number){
    return this.update(`${BASE_URL}/investors-repository`, investorId, payload).pipe(map(res =>{
      return res as PublicInvestor;
    }))
  }

  removeInvestor(investorId:number){
    return this.delete(`${BASE_URL}/investors-repository`, investorId).pipe(map(res =>{
      return res as PublicInvestor
    }))
  }

  searchInvestors(payload:Partial<UserSearch>){
    return this.create(`${BASE_URL}/investors-repository/search`, payload).pipe(map(res =>{
      return res as PublicInvestor[]
    }))
  }

  uploadInvestors(payload:FormData){
    return this.create(`${BASE_URL}/investors-repository/upload`, payload).pipe(map(res =>{
      return res as BulkCreateResponse
    }))
  }
}
