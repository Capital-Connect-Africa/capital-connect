import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeedbackService, NavbarComponent } from '../../../../../core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from "../../../../../shared/components/advertisement-space/advertisement-space.component";
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from '../../../../../shared';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { FinancialReportingService } from '../FinancialReporting.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CashFlowRecords, CashFlowRecordsPayload } from '../../../../questions/interfaces';


@Component({
  selector: 'app-cash-flow-component',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    AdvertisementSpaceComponent,
    TabViewModule, SharedModule, AngularMaterialModule, FormsModule, MultiSelectModule,
    ModalComponent, ReactiveFormsModule,
],
  templateUrl: './cashFlow.component.html',
  styleUrl: './cashFlow.component.scss',
  providers: [PaginationService]
})
export class CashFlowComponent {
  @ViewChild('financials_content', { static: false }) financials_content!: ElementRef;
  cashFlowForm!: FormGroup;

  //vars
  companyId!:number
  cashFlowRecords!:CashFlowRecords
  cashFlowData:Record<number, CashFlowRecords> ={}

  //booleans
  edit_mode:boolean = false
  createcashFlowModal:boolean = false
  

  //services
  private _fr = inject(FinancialReportingService)
  private _fs = inject(FeedbackService)
  private _fb = inject(FormBuilder)
  private _ar = inject(ActivatedRoute)
  private current_year = Number(this._ar.snapshot.params["year"])
  public sortedYears:number[] = []

  //streams
  generateCashFlow$ = new Observable<unknown>()
  getAllCashFlowRecords$ = new Observable<unknown>()
  getCashFlowRecord$ = new Observable<unknown>()
  getCashFlowRecordByCompanyId$ = new Observable<CashFlowRecords[]>()


  ngOnInit() {
    this.cashFlowForm = this._fb.group({
      companyId: [this.companyId, Validators.required],
      year: [this.current_year,Validators.required]
    });

    const companyDataString = sessionStorage.getItem('currentCompany');
      if(companyDataString){
        const companyData = JSON.parse(companyDataString);
        this.companyId = companyData.id;    

        this.getcashFlow()
      
      }
    }

    addCashFlowRecord(year?: number) {
      if (year) {
        const record = this.cashFlowData[year];
        if (record) {
          this.cashFlowForm.patchValue(record);
          this.edit_mode = true;
        }
      } else {
        this.cashFlowForm.reset({ companyId: this.companyId });
        this.edit_mode = false;
      }
      this.createcashFlowModal = true;
    }

    fetchCashFlow() {
      if (this.cashFlowForm.invalid) return;
      const formData = this.cashFlowForm.value;
          
      this.generateCashFlow$ = this._fr.generateCashFlow(formData).pipe(
        tap((res: any) => {
            this.cashFlowForm.reset();
            this.createcashFlowModal = false;
            this.cashFlowData = res as Record<number, CashFlowRecords>;
            this._fs.success("Cash flow data retrieved successfully");
        /* error: () => {
            this._fs.error("Failed to fetch cash flow data");
          }, */
        }), catchError(() => {
          this._fs.error("Failed to fetch cash flow data");
          this.createcashFlowModal = false;
          return EMPTY;
        })
      )
    }        
       
/*
    createcashFlow(){
      if(this.edit_mode){
       const formData =  this.cashFlowForm.value
       formData.id = this.cashFlowRecords.id

        this.updatecashFlowRecord$ = this._fr.updatecashFlowRecord(this.cashFlowForm.value).pipe(tap(res=>{
          this._fs.success("Balance Sheet Details Updates Successfully")  
          this.createcashFlowModal = false        
           this.getcashFlow()     
        }))
        return
      }

      this.cashFlowForm.value.companyId = this.companyId

      this.createcashFlowRecord$ = this._fr.createcashFlowRecord(this.cashFlowForm.value).pipe(tap(res=>{
        this.createcashFlowModal = false        
        this._fs.success("Balance Sheet Details Added Successfully")
        this.getcashFlow()      
      }))

    } */

    onToggleView(){

    }

    onToggleEdit(){

    }

    getRecordByYear(data:any, year:number) {
      const record = data.find((item: { year: number; }) => item.year === year);
      return record ? record : null;
   } 

    getcashFlow(){
      this.getCashFlowRecordByCompanyId$ = this._fr.getCashFlowRecordByCompanyId(this.companyId).pipe(tap(res=>{
        // this.cashFlowRecords = this.getRecordByYear(res,this.current_year)
        // this.cashFlowRecords = res[0]
        this.sortedYears = res.map((item: { year: number; }) => item.year).sort((a: number, b: number) => a - b);
        this.sortedYears.forEach((year: number) => {
          this.cashFlowData[year] = this.getRecordByYear(res, year);
        })
        if(this.cashFlowRecords){
          this.edit_mode = true
        }

        /*
        // this.current_year = res[0].year
        if(this.cashFlowRecords){
          this.cashFlowForm.patchValue({
            companyId: this.companyId,
            year: this.cashFlowRecords.year ?? 0, 
            landProperty: Number(this.cashFlowRecords.landProperty),
            plantEquipment: Number(this.cashFlowRecords.plantEquipment),
            otherNonCurrentAssets: Number(this.cashFlowRecords.otherNonCurrentAssets),
            tradeReceivables: Number(this.cashFlowRecords.tradeReceivables),
            cash: Number(this.cashFlowRecords.cash),
            inventory: Number(this.cashFlowRecords.inventory),
            otherCurrentAssets: Number(this.cashFlowRecords.otherCurrentAssets),
            tradePayables: Number(this.cashFlowRecords.tradePayables),
            otherCurrentLiabilities: Number(this.cashFlowRecords.otherCurrentLiabilities),
            loans: Number(this.cashFlowRecords.loans),
            capital: Number(this.cashFlowRecords.capital),
            otherNonCurrentLiabilities: Number(this.cashFlowRecords.otherNonCurrentLiabilities) 
          })
        } */


        
      
      }))
    }
  }



  



