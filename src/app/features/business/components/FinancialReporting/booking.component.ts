import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeedbackService, NavbarComponent } from '../../../../core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'primeng/api';
import { AngularMaterialModule } from '../../../../shared';
import { FinancialInfoRecords, FinancialInfoRecordsPayload, OpexRecords, OpexRecordsPayload, RevenueRecords, UpdateFinancialRecords } from '../../../questions/interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FinancialReportingService } from './FinancialReporting.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-financial-reporting',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    AdvertisementSpaceComponent,
    TabViewModule, SharedModule, AngularMaterialModule, FormsModule, MultiSelectModule,
    ModalComponent,ReactiveFormsModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  providers: [PaginationService]
})
export class FinancialReporting {
  financialForm!: FormGroup;


  //services
  private _fr = inject(FinancialReportingService)
  private _fs = inject(FeedbackService)
  private _fb = inject(FormBuilder)


  //booleans
  showModal: boolean = false;
  showFinancialModal: boolean = false;
  showCreateRecordModal: boolean = false;
  showCreateOpexModal: boolean = false;

  title!: string;
  helperText!: string;
  companyId: number = 0


  //observables
  //revenue
  revenueRecords$ = new Observable<unknown>()
  revenueRecord$ = new Observable<unknown>()
  createRevenueRecord$ = new Observable<unknown>()
  UpdateRevenueRecord$ = new Observable<unknown>()

  //opex
  opexRecords$ = new Observable<unknown>()
  opexRecord$ = new Observable<unknown>()
  createOpexRecord$ = new Observable<unknown>()
  UpdateOpexRecord$ = new Observable<unknown>()


  //financial info
  financialInfoRecords$ = new Observable<unknown>()
  financialInfoRecord$ = new Observable<unknown>()
  CreateFinancialInfoRecord$ = new Observable<unknown>()
  UpdateFinancialInfoRecord$ = new Observable<unknown>()



  ngOnInit() {
    this.financialForm = this._fb.group({
      revenues: [[]], // Empty array by default
      opex: [[]], // Empty array by default
    });






    const companyDataString = sessionStorage.getItem('currentCompany');

    // Check if the data exists and is not null, then parse and extract the company ID
    if (companyDataString) {
      const companyData = JSON.parse(companyDataString);
      this.companyId = companyData.id;


    this.revenueRecords$ = this._fr.getCompanyRevenueRecords(this.companyId).pipe(tap(res => {
      this.revenueRecords = res
    }))

    this.opexRecords$ = this._fr.getCompanyOpexRecords(this.companyId).pipe(tap(res => {
      this.opexRecords = res
    }))

    this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
      this.financialInfoRecords = res
      this.transformData();
    }))

    }


  }


  revenueRecords: RevenueRecords[] = [
    { id: 1, description: 'Product Sales', value: 150000 },
    { id: 2, description: 'Service Revenue', value: 85000 },
  ];

  opexRecords: OpexRecords[] = [
    { id: 1, description: 'Office Supplies', value: 12000 },
    { id: 2, description: 'Salaries', value: 60000 },
  ];

  financialInfoRecords: FinancialInfoRecords[] = [
    {
      id: 1,
      year: 2024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Approved',
      notes: 'Quarterly report finalized',
      revenues: [],
      opex: [],
      company: { id: 1 },
      user: { username: 'finance_admin' }
    }
  ];

  newRevenue: RevenueRecords = { id: 0, description: '', value: 0 };
  newOpex: OpexRecords = { id: 0, description: '', value: 0 };

  selectedRevenue: RevenueRecords | null = null;
  selectedOpex: OpexRecords | null = null;

  addRevenue() {
    const newId = this.revenueRecords.length + 1;
    this.revenueRecords.push({ ...this.newRevenue, id: newId });
    this.newRevenue = { id: 0, description: '', value: 0 };
  }

  updateRevenue() {
    if (this.selectedRevenue) {
      const index = this.revenueRecords.findIndex(r => r.id === this.selectedRevenue!.id);
      this.revenueRecords[index] = { ...this.selectedRevenue };
      this.selectedRevenue = null;
    }
  }

  addOpex() {
    const newId = this.opexRecords.length + 1;
    this.opexRecords.push({ ...this.newOpex, id: newId });
    this.newOpex = { id: 0, description: '', value: 0 };
  }

  updateOpex() {
    if (this.selectedOpex) {
      const index = this.opexRecords.findIndex(o => o.id === this.selectedOpex!.id);
      this.opexRecords[index] = { ...this.selectedOpex };
      this.selectedOpex = null;
    }
  }


  view_revenue_records: boolean = false
  update_revenue_records: boolean = false
  view_opex_records: boolean = false
  update_opex_records: boolean = false

  viewMode = true; // Controls whether the modal is in "view" or "edit" mode
  currentRecord!: OpexRecords;
  currentFinancialRecord!: FinancialInfoRecords



  showModalFunc(record: RevenueRecords | OpexRecords, value: string) {
    this.closeModal();
    this.showModal = true;
    this.currentRecord = { ...record }; // Clone the record to avoid modifying the original directly

    switch (value) {
      case "view_revenue_records":
        this.title = "Revenue Records";
        this.helperText = "Revenue Record Details";
        this.view_revenue_records = true;
        this.update_revenue_records = false;
        this.revenueRecord$ = this._fr.getRevenueRecord(record.id).pipe(tap(res => [
          this.currentRecord = res
        ]))
        break;

      case "update_revenue_records":
        this.title = "Revenue Records";
        this.helperText = "Update Revenue Record Details";
        this.view_revenue_records = false;
        this.update_revenue_records = true;
        this.revenueRecord$ = this._fr.getRevenueRecord(record.id).pipe(tap(res => [
          this.currentRecord = res
        ]))
        break;

      case "view_opex_records":
        this.title = "Opex Records";
        this.helperText = "Operational Expenditure Record Details";
        this.view_opex_records = true;
        this.update_opex_records = false;
        this.opexRecord$ = this._fr.getOpexRecord(record.id).pipe(tap(res => [
          this.currentRecord = res
        ]))
        break;

      case "update_opex_records":
        this.title = "Opex Records";
        this.helperText = "Update Operational Expenditure Record Details";
        this.view_opex_records = false;
        this.update_opex_records = true;
        this.opexRecord$ = this._fr.getOpexRecord(record.id).pipe(tap(res => [
          this.currentRecord = res
        ]))
        break;
    }
  }

  saveUpdates() {
    if (this.update_revenue_records) {
      const index = this.revenueRecords.findIndex(r => r.id === this.currentRecord.id);
      if (index !== -1) {
        this.revenueRecords[index] = { ...this.currentRecord };
        this.UpdateRevenueRecord$ = this._fr.updateRevenueRecord(this.revenueRecords[index]).pipe(tap(res => {
          this._fs.success("Revenue Record Updated Successfully")
          this.revenueRecords$ = this._fr.getCompanyRevenueRecords(this.companyId).pipe(tap(res => {
            this.revenueRecords = res
          }))

          this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
            this.financialInfoRecords = res
            this.transformData();
          }))
        }))
      }
    } else if (this.update_opex_records) {
      const index = this.opexRecords.findIndex(o => o.id === this.currentRecord.id);
      if (index !== -1) {
        this.opexRecords[index] = { ...this.currentRecord };
        this.UpdateOpexRecord$ = this._fr.updateOpexRecord(this.opexRecords[index]).pipe(tap(res => {
          this._fs.success("Opex Record Updated Successfully")
          this.opexRecords$ = this._fr.getAllOpexRecords().pipe(tap(res => {
            this.opexRecords = res
          }))

          this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
            this.financialInfoRecords = res
            this.transformData();
          }))
        }))
      }
    }

    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.currentRecord = null!;
    this.view_revenue_records = false;
    this.update_revenue_records = false;
    this.view_opex_records = false;
    this.update_opex_records = false;
  }



  view_financial_info = false;
  update_financial_info = false;

  showModalFuncFinancial(record: any, action: string) {
    this.currentFinancialRecord = { ...record };

    this.patchFormData({
      revenues:this.currentFinancialRecord.revenues,
      opex:this.currentFinancialRecord.opex
    })


    this.financialInfoRecord$ = this._fr.getFinancialRecord(record.id).pipe(tap(res => [
      this.currentFinancialRecord = res
      
    ]))

    this.view_financial_info = action === 'view_financial_info';
    this.update_financial_info = action === 'update_financial_info';
    this.title =
      action === 'view_financial_info'
        ? 'View Financial Information'
        : 'Update Financial Information';
    this.helperText =
      action === 'view_financial_info'
        ? 'View details of the financial record.'
        : 'Update the details of the financial record.';
    this.showFinancialModal = true;
  }


  patchFormData(data: any): void {
    // Patch values into the form
    this.financialForm.patchValue({
      revenues: data.revenues.map((rec: { id: any; }) => rec.id),
      opex: data.opex.map((rec: { id: any; }) => rec.id),
    });
  }


  newOpexRecord: OpexRecordsPayload = { description: "", value: 0 ,year:0, companyId:this.companyId};
  newRevenueRecord: OpexRecordsPayload = { description: "", value: 0 ,year:0,companyId:this.companyId};

  CreateOpexRecord() {
    this.newOpexRecord.companyId = this.companyId
    this.createOpexRecord$ = this._fr.createOpexRecord(this.newOpexRecord).pipe(tap(res => {
      this.showCreateOpexModal = false;
      this._fs.success("Opex Record Created Successfully")
      this.opexRecords$ = this._fr.getCompanyOpexRecords(this.companyId).pipe(tap(res => {
        this.opexRecords = res
      }))
    }))
  }


  createRevenueRecord() {
    this.newRevenueRecord.companyId = this.companyId
    this.createRevenueRecord$ = this._fr.createRevenueRecord(this.newRevenueRecord).pipe(tap(res => {
      this.showCreateRecordModal = false;
      this._fs.success("Opex Record Created Successfully")
      this.revenueRecords$ = this._fr.getCompanyRevenueRecords(this.companyId).pipe(tap(res => {
        this.revenueRecords = res
      }))
    }))
  }


  addRevenueRecord() {
    this.showCreateRecordModal = true;
  }

  addOpexRecord() {
    this.showCreateOpexModal = true;
  }

  createFinancialModal: boolean = false;

  addFinancialRecord() {
    this.createFinancialModal = true
  }

  newFinancialRecord: FinancialInfoRecordsPayload = {
    companyId: this.companyId,
    year: 0,
    revenues: [],
    opex: []
  };


  createFinancial() {
    this.newFinancialRecord.companyId = this.companyId
    this.CreateFinancialInfoRecord$ = this._fr.createFinancialRecord(this.newFinancialRecord).pipe(tap(res => {
      this.createFinancialModal = false

      this._fs.success("Financial Information Created Successfully")
      this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
        this.financialInfoRecords = res
        this.transformData();
      }))
    }))
  }


  opexData: any[] = [];
  revenueData: any[] = [];

  reversedTableData: any[] = [];

  years: number[] = [];

  transformData() {
    // Collect all years and sort them in ascending order
    this.years = Array.from(
      new Set(this.financialInfoRecords.map((item) => item.year))
    ).sort((a, b) => a - b); // Sort numerically in ascending order
  
    // Prepare rows with descriptions and values
    const opex_rows: any = {};
    const revenue_rows: any = {};

  
    this.financialInfoRecords.forEach((entry) => {
      const year = entry.year;
  
      // Handle revenues
      entry.revenues.forEach((rev: any) => {
        if (!revenue_rows[rev.description]) {
          revenue_rows[rev.description] = { description: rev.description };
        }
        revenue_rows[rev.description][year] = rev.value;
      });
  
      // Handle opex
      entry.opex.forEach((opex: any) => {
        if (!opex_rows[opex.description]) {
          opex_rows[opex.description] = { description: opex.description };
        }
        opex_rows[opex.description][year] = opex.value;
      });
    });
  
    // Convert rows object to array for PrimeNG table
    this.opexData = Object.values(opex_rows);
    this.revenueData = Object.values(revenue_rows);

  }
  







  saveUpdatesFinancial() {
    const extractedObject: UpdateFinancialRecords = {
      id: this.currentFinancialRecord.id,
      year: this.currentFinancialRecord.year, // Override year as per requirement
      status: this.currentFinancialRecord.status,
      notes: this.currentFinancialRecord.notes, // `null` if explicitly required
      revenues: this.financialForm.value.revenues,
      opex: this.financialForm.value.revenues,
      companyId: this.currentFinancialRecord.company.id
    };


    this.UpdateFinancialInfoRecord$ = this._fr.updateFinancialRecord(extractedObject).pipe(tap(res => {
      this._fs.success("Financial Records Updated Successfully")
      this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
        this.financialInfoRecords = res
        this.showFinancialModal = false;
      }))
    }))
  }




  handleYearClick(year: number) {
    const foundRecord = this.financialInfoRecords.find(record => record.year === year);
    if (foundRecord) {
      this.showModalFuncFinancial(foundRecord, 'update_financial_info');
    } else {
      console.error('Record not found for year:', year);
    }
  }


  // updateReversedData() {
  //   this.reversedTableData = [...this.tableData].reverse();
  // }


  
}
