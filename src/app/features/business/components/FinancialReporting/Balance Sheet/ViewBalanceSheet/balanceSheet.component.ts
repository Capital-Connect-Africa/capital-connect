import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { tap} from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeedbackService, NavbarComponent } from '../../../../../../core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from "../../../../../../shared/components/advertisement-space/advertisement-space.component";
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from '../../../../../../shared';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../../../../../../shared/components/modal/modal.component";
import { FinancialReportingService } from '../../FinancialReporting.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewFinancialReporting } from "../../viewFinanciallReport/viewFinancials.component";
import { BalanceSheetRecord } from '../../../../../questions/interfaces';


@Component({
  selector: 'app-balance-sheet',
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
    ViewFinancialReporting
],
  templateUrl: './balanceSheet.component.html',
  styleUrl: './balanceSheet.component.scss',
  providers: [PaginationService]
})
export class BalanceSheet {
  @ViewChild('financials_content', { static: false }) financials_content!: ElementRef;
  balanceSheetForm!: FormGroup;

  //vars
  companyId!:number
  balanceSheetRecords!:BalanceSheetRecord
  current_year!:number

  //booleans
  edit_mode:boolean = false
  createBalanceSheetModal:boolean = false
  

  //services
  private _fr = inject(FinancialReportingService)
  private _fs = inject(FeedbackService)
  private _fb = inject(FormBuilder)
  private _ar = inject(ActivatedRoute)

  //streams
  createBalanceSheetRecord$ = new Observable<unknown>()
  getAllBalanceSheetRecords$ = new Observable<unknown>()
  getBalanceSheetRecordById$ = new Observable<unknown>()
  getBalanceSheetRecordByCompanyId$ = new Observable<BalanceSheetRecord[]>()
  updateBalanceSheetRecord$ = new Observable<unknown>()


  ngOnInit() {
    this.balanceSheetForm = this._fb.group({
      companyId:[0,Validators.required],
      year: [this.current_year,Validators.required],
      landProperty: [0,Validators.required],
      plantEquipment: [0,Validators.required],
      otherNonCurrentAssets: [0,Validators.required],
      tradeReceivables: [0,Validators.required],
      cash: [0,Validators.required],
      inventory: [0,Validators.required],
      otherCurrentAssets:[0,Validators.required],
      tradePayables: [0,Validators.required],
      otherCurrentLiabilities: [0,Validators.required],
      loans: [0,Validators.required],
      capital: [0,Validators.required],
      otherNonCurrentLiabilities: [0,Validators.required]
    });

    const companyDataString = sessionStorage.getItem('currentCompany');
      if(companyDataString){
        const companyData = JSON.parse(companyDataString);
        this.companyId = companyData.id;

        this._ar.paramMap.subscribe(params => {
          this.current_year = Number(params.get('year'));
          console.log("The current year received is",this.current_year)
        });
    

        this.getBalanceSheet()
      
      }
    }


    addBalanceSheetRecord(){
      this.balanceSheetForm.value.year = this.current_year
      this.createBalanceSheetModal = true

      this.balanceSheetForm.patchValue({
        year: this.current_year 
      })

    }

    createBalanceSheet(){
      if(this.edit_mode){
       const formData =  this.balanceSheetForm.value
       formData.id = this.balanceSheetRecords.id

        this.updateBalanceSheetRecord$ = this._fr.updateBalanceSheetRecord(this.balanceSheetForm.value).pipe(tap(res=>{
          this._fs.success("Balance Sheet Details Updates Successfully")  
          this.createBalanceSheetModal = false        
           this.getBalanceSheet()     
        }))
        return
      }

      this.balanceSheetForm.value.companyId = this.companyId

      this.createBalanceSheetRecord$ = this._fr.createBalanceSheetRecord(this.balanceSheetForm.value).pipe(tap(res=>{
        this.createBalanceSheetModal = false        
        this._fs.success("Balance Sheet Details Added Successfully")
        this.getBalanceSheet()      
      }))

    }

    onToggleView(){

    }

    onToggleEdit(){

    }

    getRecordByYear(data:any, year:number) {
      const record = data.find((item: { year: number; }) => item.year === year);
      return record ? record : null;
   } 

    getBalanceSheet(){
      this.getBalanceSheetRecordByCompanyId$ = this._fr.getAllBalanceSheetRecordByCompanyId(this.companyId).pipe(tap(res=>{
        this.balanceSheetRecords = this.getRecordByYear(res,this.current_year)

        if(this.balanceSheetRecords){
          this.edit_mode = true
        }

        // this.current_year = res[0].year
        if(this.balanceSheetRecords){
          this.balanceSheetForm.patchValue({
            companyId: this.companyId,
            year: this.balanceSheetRecords.year ?? 0, 
            landProperty: Number(this.balanceSheetRecords.landProperty),
            plantEquipment: Number(this.balanceSheetRecords.plantEquipment),
            otherNonCurrentAssets: Number(this.balanceSheetRecords.otherNonCurrentAssets),
            tradeReceivables: Number(this.balanceSheetRecords.tradeReceivables),
            cash: Number(this.balanceSheetRecords.cash),
            inventory: Number(this.balanceSheetRecords.inventory),
            otherCurrentAssets: Number(this.balanceSheetRecords.otherCurrentAssets),
            tradePayables: Number(this.balanceSheetRecords.tradePayables),
            otherCurrentLiabilities: Number(this.balanceSheetRecords.otherCurrentLiabilities),
            loans: Number(this.balanceSheetRecords.loans),
            capital: Number(this.balanceSheetRecords.capital),
            otherNonCurrentLiabilities: Number(this.balanceSheetRecords.otherNonCurrentLiabilities) 
          })
        }


        
      
      }))
    }
  }



  



