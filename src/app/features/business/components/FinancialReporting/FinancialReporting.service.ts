import { Injectable } from '@angular/core';
import { BASE_URL, BaseHttpService } from '../../../../core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, mergeMap, Observable, switchMap } from 'rxjs';
import { AddNotesToFinancialecords, BalanceSheetRecord, BalanceSheetRecordPayload, FinancialInfoRecords, FinancialInfoRecordsPayload, OpexRecords, OpexRecordsPayload, RevenueRecords, UpdateFinancialRecords } from '../../../questions/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportingService extends BaseHttpService {

  constructor(private _httpClient: HttpClient) {
    super(_httpClient)
  }

  /*******************************Balance Sheet************************* */
  createBalanceSheetRecord(payload: BalanceSheetRecordPayload) {
    return this.create(`${BASE_URL}/balance-sheet`, payload) as Observable<unknown>
  }

  getAllBalanceSheetRecords(){
    return this.read(`${BASE_URL}/balance-sheet`) as Observable<RevenueRecords[]>
  }

  getAllBalanceSheetRecordById(id:number){
    return this.read(`${BASE_URL}/balance-sheet/${id}`) as Observable<RevenueRecords[]>
  }

  getAllBalanceSheetRecordByCompanyId(id:number){
    return this.read(`${BASE_URL}/balance-sheet/company/${id}`) as Observable<BalanceSheetRecord[]>
  }

  updateBalanceSheetRecord(payload: BalanceSheetRecord) {
    return this.create(`${BASE_URL}/balance-sheet`, payload) as Observable<unknown>
  }


  //Revenue Records
  createRevenueRecord(payload: OpexRecordsPayload) {
    return this.create(`${BASE_URL}/revenues`, payload) as Observable<unknown>
  }

  getAllRevenueRecords() :Observable<RevenueRecords[]>{
    return this.read(`${BASE_URL}/revenues`) as Observable<RevenueRecords[]>
  }

  getCompanyRevenueRecords(companyId:number) :Observable<RevenueRecords[]>{
    return this.read(`${BASE_URL}/revenues/company/${companyId}`) as Observable<RevenueRecords[]>
  }

  getRevenueRecord(id: number):Observable<RevenueRecords>{
    return this.readById(`${BASE_URL}/revenues`, id) as Observable<RevenueRecords>
  }

  updateRevenueRecord(payload: RevenueRecords) {
    return this.update(`${BASE_URL}/revenues`, payload.id, payload) as Observable<unknown>
  }


  //Cost Of Sales
  createCostOfSaleRecord(payload: OpexRecordsPayload) {
    return this.create(`${BASE_URL}/cost-of-sales`, payload) as Observable<unknown>
  }

  getAllCostOfSaleRecords() :Observable<RevenueRecords[]>{
    return this.read(`${BASE_URL}/cost-of-sales`) as Observable<RevenueRecords[]>
  }

  getCompanyRCostOfSaleRecords(companyId:number) :Observable<RevenueRecords[]>{
    return this.read(`${BASE_URL}/cost-of-sales/company/${companyId}`) as Observable<RevenueRecords[]>
  }

  getCostOfSalesRecord(id: number):Observable<RevenueRecords>{
    return this.readById(`${BASE_URL}/cost-of-sales`, id) as Observable<RevenueRecords>
  }

  updateCostOfSaleRecord(payload: RevenueRecords) {
    return this.update(`${BASE_URL}/cost-of-sales`, payload.id, payload) as Observable<unknown>
  }
  


  //Opex records
  createOpexRecord(payload: OpexRecordsPayload) {
    return this.create(`${BASE_URL}/opex`, payload) as Observable<unknown>
  }

  getAllOpexRecords() :Observable<OpexRecords[]>{
    return this.read(`${BASE_URL}/opex`) as Observable<OpexRecords[]>
  }

  getCompanyOpexRecords(companyId:number) :Observable<OpexRecords[]>{
    return this.read(`${BASE_URL}/opex/company/${companyId}`) as Observable<OpexRecords[]>
  }

  getOpexRecord(id: number):Observable<OpexRecords>{
    return this.readById(`${BASE_URL}/opex`, id) as Observable<OpexRecords>
  }

  updateOpexRecord(payload: OpexRecords) {
    return this.update(`${BASE_URL}/opex`, payload.id, payload) as Observable<unknown>
  }



  //Financial records
  createFinancialRecord(payload: FinancialInfoRecordsPayload) {
    return this.create(`${BASE_URL}/finances`, payload) as Observable<unknown>
  }

  getAllCompanyFinancialRecords(companyId:number) :Observable<FinancialInfoRecords[]>{
    return this.read(`${BASE_URL}/finances/company/${companyId}`) as Observable<FinancialInfoRecords[]>
  }

  getAllFinancialRecords() :Observable<FinancialInfoRecords[]>{
    return this.read(`${BASE_URL}/finances`) as Observable<FinancialInfoRecords[]>
  }

  getFinancialRecord(id: number):Observable<FinancialInfoRecords>{
    return this.readById(`${BASE_URL}/finances`, id) as Observable<FinancialInfoRecords>
  }

  updateFinancialRecord(payload: UpdateFinancialRecords) {
    return this.update(`${BASE_URL}/finances`, payload.id, payload) as Observable<unknown>
  }


  //add notes to financial records
  addNotesToFinancialRecords(payload:AddNotesToFinancialecords,recordId:number){
    return this.putPost(`${BASE_URL}/finances/${recordId}/notes`, payload) as Observable<unknown>
  }



  //Reject a financial information record.
  rejectApproveFinancialRecord(recordId:number,status:string){
    return this.put(`${BASE_URL}/finances/${recordId}/${status}`) as Observable<unknown>
  }
}
