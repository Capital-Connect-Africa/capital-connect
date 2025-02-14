import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
import { ViewFinancialReporting } from "../viewFinanciallReport/viewFinancials.component";

interface BalanceSheetRecord {
  id: number;
  year: number;
  landProperty: number;
  plantEquipment: number;
  otherNonCurrentAssets: number;
  tradeReceivables: number;
  cash: number;
  inventory: number;
  otherCurrentAssets: number;
  totalAssets: number;
  tradePayables: number;
  otherCurrentLiabilities: number;
  loans: number;
  capital: number;
  otherNonCurrentLiabilities: number;
  totalLiabilities: number;
  companyId: number;
}

@Component({
  selector: 'app-balance-sheets',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    AdvertisementSpaceComponent,
    TabViewModule,
    SharedModule,
    AngularMaterialModule,
    FormsModule,
    MultiSelectModule,
    ModalComponent,
    ReactiveFormsModule,
    ViewFinancialReporting
  ],
  templateUrl: './balanceSheets.component.html',
  styleUrl: './balanceSheets.component.scss',
  providers: [PaginationService]
})
export class BalanceSheets {
  @ViewChild('financials_content', { static: false }) financials_content!: ElementRef;
  balanceSheetForm!: FormGroup;

  balanceSheetData: { [year: number]: BalanceSheetRecord } = {};
  sortedYears: number[] = [];
  companyId!: number;
  createBalanceSheetModal = false;
  edit_mode = false;

  private _fr = inject(FinancialReportingService);
  private _fs = inject(FeedbackService);
  private _fb = inject(FormBuilder);


  //streams
  createBalanceSheetRecord$ = new Observable<unknown>()
  getAllBalanceSheetRecords$ = new Observable<unknown>()
  getBalanceSheetRecordById$ = new Observable<unknown>()
  getBalanceSheetRecordByCompanyId$ = new Observable<unknown>()
  updateBalanceSheetRecord$ = new Observable<unknown>()


  ngOnInit() {
    this.initializeForm();
    this.loadCompanyData();
  }
  
  loadCompanyData() {
    const companyDataString = sessionStorage.getItem('currentCompany');
    if (companyDataString) {
      const companyData = JSON.parse(companyDataString);
      this.companyId = companyData.id;
      this.loadBalanceSheets();
    }
  }
  
  loadBalanceSheets() {
    this.getBalanceSheetRecordByCompanyId$ = this._fr.getAllBalanceSheetRecordByCompanyId(this.companyId).pipe(
      tap(res => {
        this.sortedYears = res.map(r => r.year).sort((a, b) => a - b);
        this.balanceSheetData = {};
        res.forEach(record => {
          console.log("Record : ", record);
          this.balanceSheetData[record.year] = { ...record, companyId: this.companyId };
        });
  
        if (this.sortedYears.length > 0) {
          const latestYear = Math.max(...this.sortedYears);
          this.patchFormWithYearData(latestYear);
        }
      })
    );
  }

 
  initializeForm() {
    this.balanceSheetForm = this._fb.group({
      id: [0],
      companyId: [0, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      landProperty: [0, Validators.required],
      plantEquipment: [0, Validators.required],
      otherNonCurrentAssets: [0, Validators.required],
      tradeReceivables: [0, Validators.required],
      cash: [0, Validators.required],
      inventory: [0, Validators.required],
      otherCurrentAssets: [0, Validators.required],
      tradePayables: [0, Validators.required],
      otherCurrentLiabilities: [0, Validators.required],
      loans: [0, Validators.required],
      capital: [0, Validators.required],
      otherNonCurrentLiabilities: [0, Validators.required]
    });
  }



  getBalanceSheet(){
    this.getBalanceSheetRecordByCompanyId$ = this._fr.getAllBalanceSheetRecordByCompanyId(365).pipe(tap(res=>{
        console.log(res)
    }))
  }







  // loadBalanceSheets() {
  //   console.log("Loading sheets ...")

  //   this.getBalanceSheetRecordByCompanyId$ = this._fr.getAllBalanceSheetRecordById(this.companyId).pipe(tap(res=>{
  //     this.sortedYears = res.map(r => r.year).sort((a, b) => a - b);
  //       this.balanceSheetData = {};
  //       res.forEach(record => {
  //         console.log("Record : ", record)
  //         // this.balanceSheetData[record.year] = record;
  //       });

  //       if (this.sortedYears.length > 0) {
  //         const latestYear = Math.max(...this.sortedYears);
  //         this.patchFormWithYearData(latestYear);
  //       }

  //   }))

  // }

  patchFormWithYearData(year: number) {
    const record = this.balanceSheetData[year];
    if (record) {
      this.balanceSheetForm.patchValue(record);
      this.edit_mode = true;
    }
  }

  addBalanceSheetRecord() {
    this.balanceSheetForm.reset({ companyId: this.companyId });
    this.createBalanceSheetModal = true;
  }

  createBalanceSheet() {
    if (this.balanceSheetForm.invalid) return;

    const operation = this.edit_mode 
      ? this._fr.updateBalanceSheetRecord(this.balanceSheetForm.value)
      : this._fr.createBalanceSheetRecord(this.balanceSheetForm.value);

    operation.subscribe({
      next: () => {
        this._fs.success(`Record ${this.edit_mode ? 'updated' : 'created'} successfully`);
        this.createBalanceSheetModal = false;
        this.loadBalanceSheets();
      },
      error: (err) => this._fs.error("Operation failed")
    });
  }

  onToggleView() { /* Implement view toggle logic if needed */ }
  onToggleEdit() { /* Implement edit toggle logic if needed */ }
}