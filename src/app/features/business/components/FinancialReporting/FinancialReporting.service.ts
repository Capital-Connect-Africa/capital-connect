import { Injectable } from '@angular/core';
import { BASE_URL, BaseHttpService } from '../../../../core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, mergeMap, Observable, switchMap } from 'rxjs';
import { FinancialInfoRecords, OpexRecords, RevenueRecords } from '../../../questions/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportingService extends BaseHttpService {

  constructor(private _httpClient: HttpClient) {
    super(_httpClient)
  }

  //Revenue Records
  createRevenueRecord(payload: RevenueRecords) {
    return this.create(`${BASE_URL}/revenues`, payload) as Observable<unknown>
  }

  getAllRevenueRecords() :Observable<RevenueRecords[]>{
    return this.read(`${BASE_URL}/revenues`) as Observable<RevenueRecords[]>
  }

  getRevenueRecord(id: number):Observable<RevenueRecords>{
    return this.readById(`${BASE_URL}/revenues`, id) as Observable<RevenueRecords>
  }

  updateRevenueRecord(payload: RevenueRecords) {
    return this.update(`${BASE_URL}/revenues`, payload.id, payload) as Observable<unknown>
  }


  //Opex records
  createOpexRecord(payload: OpexRecords) {
    return this.create(`${BASE_URL}/opex`, payload) as Observable<unknown>
  }

  getAllOpexRecords() :Observable<OpexRecords[]>{
    return this.read(`${BASE_URL}/opex`) as Observable<OpexRecords[]>
  }

  getOpexRecord(id: number):Observable<OpexRecords>{
    return this.readById(`${BASE_URL}/opex`, id) as Observable<OpexRecords>
  }

  updateOpexRecord(payload: OpexRecords) {
    return this.update(`${BASE_URL}/opex`, payload.id, payload) as Observable<unknown>
  }



  //Financial records
  createFinancialRecord(payload: FinancialInfoRecords) {
    return this.create(`${BASE_URL}/finances`, payload) as Observable<unknown>
  }

  getAllFinancialRecords() :Observable<FinancialInfoRecords[]>{
    return this.read(`${BASE_URL}/finances`) as Observable<FinancialInfoRecords[]>
  }

  getFinancialRecord(id: number):Observable<FinancialInfoRecords>{
    return this.readById(`${BASE_URL}/finances`, id) as Observable<FinancialInfoRecords>
  }

  updateFinancialRecord(payload: FinancialInfoRecords) {
    return this.update(`${BASE_URL}/finances`, payload.id, payload) as Observable<unknown>
  }



}
