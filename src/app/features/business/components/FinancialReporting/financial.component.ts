import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { tap} from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeedbackService, NavbarComponent } from '../../../../core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
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
import { ViewFinancialReporting } from "./viewFinanciallReport/viewFinancials.component";
import { PdfGeneratorService } from '../../../../shared/services/pdf-generator.service';



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
    ModalComponent, ReactiveFormsModule,
    ViewFinancialReporting
],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.scss',
  providers: [PaginationService]
})
export class FinancialReporting {
  @ViewChild('financials_content', { static: false }) financials_content!: ElementRef;
  financialForm!: FormGroup;


  //services
  private _fr = inject(FinancialReportingService)
  private _fs = inject(FeedbackService)
  private _fb = inject(FormBuilder)
  private _router = inject(Router)
  private _pdfService = inject(PdfGeneratorService);
  


  //booleans
  showModal: boolean = false;
  showFinancialModal: boolean = false;
  showCreateRecordModal: boolean = false;
  showCreateCostOfSalesModal:boolean = false
  showCreateOpexModal: boolean = false;
  edit_mode: boolean = false

  title!: string;
  helperText!: string;
  companyId: number = 0


  //observables
  //revenue
  revenueRecords$ = new Observable<unknown>()
  revenueRecord$ = new Observable<unknown>()
  createRevenueRecord$ = new Observable<unknown>()
  UpdateRevenueRecord$ = new Observable<unknown>()

  //Cost of sales records
  costOfSalesRecords$ = new Observable<unknown>()
  costOfSalesRecord$ = new Observable<unknown>()
  createCostOfSaleRecord$ = new Observable<unknown>()
  UpdateCostOfSaleRecord$ = new Observable<unknown>()

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
      costOfSales:[[]],
      interests:[0],
      amorDep:[0],
      taxes:[0],
      year:[0]
    });


    const companyDataString = sessionStorage.getItem('currentCompany');

    // Check if the data exists and is not null, then parse and extract the company ID
    if (companyDataString) {
      const companyData = JSON.parse(companyDataString);
      this.companyId = companyData.id;


    this.revenueRecords$ = this._fr.getCompanyRevenueRecords(this.companyId).pipe(tap(res => {
      this.revenueRecords = res
    }))


    this.costOfSalesRecords$ = this._fr.getCompanyRCostOfSaleRecords(this.companyId).pipe(tap(res => {
      this.costOfSalesRecords = res
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


  revenueRecords: RevenueRecords[] = [];
  costOfSalesRecords: RevenueRecords[] = []
  opexRecords: OpexRecords[] = [];

  financialInfoRecords: FinancialInfoRecords[] = [];

  newRevenue: RevenueRecords = { id: 0, description: '', value: 0,year:0 };
  newOpex: OpexRecords = { id: 0, description: '', value: 0 ,year:0};
  newCostOfSales: OpexRecords = { id: 0, description: '', value: 0 ,year:0};


  selectedRevenue: RevenueRecords | null = null;
  selectedOpex: OpexRecords | null = null;
  selectedCostOfSales: OpexRecords | null = null;

  addRevenue() {
    const newId = this.revenueRecords.length + 1;
    this.revenueRecords.push({ ...this.newRevenue, id: newId });
    this.newRevenue = { id: 0, description: '', value: 0 ,year:0};
  }

  updateRevenue() {
    if (this.selectedRevenue) {
      const index = this.revenueRecords.findIndex(r => r.id === this.selectedRevenue!.id);
      this.revenueRecords[index] = { ...this.selectedRevenue };
      this.selectedRevenue = null;
    }
  }


  addCostOfSale() {
    const newId = this.costOfSalesRecords.length + 1;
    this.costOfSalesRecords.push({ ...this.newCostOfSales, id: newId });
    this.newCostOfSales = { id: 0, description: '', value: 0 ,year:0};
  }

  updateCostOfSale() {
    if (this.selectedCostOfSales) {
      const index = this.costOfSalesRecords.findIndex(r => r.id === this.selectedCostOfSales!.id);
      this.costOfSalesRecords[index] = { ...this.selectedCostOfSales };
      this.selectedCostOfSales = null;
    }
  }


  addOpex() {
    const newId = this.opexRecords.length + 1;
    this.opexRecords.push({ ...this.newOpex, id: newId });
    this.newOpex = { id: 0, description: '', value: 0 ,year:0};
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

  view_cost_of_sales_records: boolean = false
  update_cost_of_sales_records: boolean = false

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


      case "view_cost_of_sales_records":
          this.title = "Cost Of Sales Records";
          this.helperText = "Cost Of Sales Record Details";
          this.view_cost_of_sales_records = true;
          this.update_cost_of_sales_records = false;
          this.costOfSalesRecord$ = this._fr.getCostOfSalesRecord(record.id).pipe(tap(res => [
            this.currentRecord = res
          ]))
          break;
  
      case "update_cost_of_sales_records":
          this.title = "Cost Of Sales Records";
          this.helperText = "Update Cost Of Sales Record Details";
          this.view_revenue_records = false;
          this.update_revenue_records = true;
          this.costOfSalesRecord$ = this._fr.getCostOfSalesRecord(record.id).pipe(tap(res => [
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
    console.log("Revenue ....", this.update_revenue_records)
    console.log("Cost of sales....", this.update_cost_of_sales_records)
    console.log("Opex records.....", this.update_opex_records)


    if (this.update_revenue_records) {
      console.log("Reached here ..... 1")
      const index = this.revenueRecords.findIndex(r => r.id === this.currentRecord.id);
      if (index !== -1) {
        console.log("Reached here ..... 2")

        this.revenueRecords[index] = { ...this.currentRecord };

        console.log("Reached here ..... 3")

        this.UpdateRevenueRecord$ = this._fr.updateRevenueRecord(this.revenueRecords[index]).pipe(tap(res => {
          console.log("Reached here ..... 4")

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
    }else if (this.update_cost_of_sales_records) {
      const index = this.costOfSalesRecords.findIndex(r => r.id === this.currentRecord.id);
      if (index !== -1) {
        this.costOfSalesRecords[index] = { ...this.currentRecord };
        this.UpdateCostOfSaleRecord$ = this._fr.updateCostOfSaleRecord(this.costOfSalesRecords[index]).pipe(tap(res => {
          this._fs.success("Cost Of Sales Record Updated Successfully")
          this.costOfSalesRecords$ = this._fr.getCompanyRCostOfSaleRecords(this.companyId).pipe(tap(res => {
            this.costOfSalesRecords = res
          }))

          this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
            this.financialInfoRecords = res
            this.transformData();
          }))
        }))
      }
    }    
    else if (this.update_opex_records) {
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
    this.showFinancialModal = false
  }



  view_financial_info = false;
  update_financial_info = false;

  showModalFuncFinancial(record: any, action: string) {
    this.currentFinancialRecord = { ...record };

    this.patchFormData({
      revenues:this.currentFinancialRecord.revenues,
      opex:this.currentFinancialRecord.opex,
      year:this.currentFinancialRecord.year,
      ebit:this.currentFinancialRecord.ebit,
      ebitda:this.currentFinancialRecord.ebitda,
      costOfSales:this.currentFinancialRecord.costOfSales,
      taxes:this.currentFinancialRecord.taxes,
      interests:this.currentFinancialRecord.interests,
      amorDep:this.currentFinancialRecord.amorDep
    }, this.currentFinancialRecord.year)

    this.view_financial_info = action === 'view_financial_info';
    this.update_financial_info = action === 'update_financial_info';
    this.title =
      action === 'view_financial_info'
        ? 'View Financial Information'
        : 'View Financial Information';
    this.helperText =
      action === 'view_financial_info'
        ? 'View details of the financial record.'
        : 'View the details of the financial record.';
    this.showFinancialModal = true;
  }


  patchFormData(data: any, year: number): void {
    console.log("Te data to be patched is ...", data)
    const filteredRevenues = data.revenues.filter((rec: { year: number }) => rec.year === year);
    const filteredOpex = data.opex.filter((rec: { year: number }) => rec.year === year);
    this.financialForm.patchValue({
      revenues: filteredRevenues.map((rec: { id: any }) => rec.id) || [],
      opex: filteredOpex.map((rec: { id: any }) => rec.id) || [],
      costOfSales: data.costOfSales,
      ebit: data.ebit,
      ebitda: data.ebitda,
      taxes: data.taxes,
      year: data.year,
      amorDep: data.amorDep,
      interests:data.interests,      

    });
  }
  


  newOpexRecord: OpexRecordsPayload = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : 0, companyId:this.companyId};
  newRevenueRecord: OpexRecordsPayload = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : 0,companyId:this.companyId};
  newCostOfSalesRecord: OpexRecordsPayload = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : 0,companyId:this.companyId};


  CreateOpexRecord() {
    this.newOpexRecord.companyId = this.companyId
    this.createOpexRecord$ = this._fr.createOpexRecord(this.newOpexRecord).pipe(tap(res => {
      this.showCreateOpexModal = false;
      this._fs.success("Opearting Expense Created Successfully")
      this.opexRecords$ = this._fr.getCompanyOpexRecords(this.companyId).pipe(tap(res => {
        this.opexRecords = res
        this.newOpexRecord = { description: "", value: 0 ,year:0,companyId:this.companyId}
        this.updateRecordsByYear(this.currentFinancialRecord.year)
      }))
    }))
  }


  createRevenueRecord() {
    this.newRevenueRecord.companyId = this.companyId
    this.createRevenueRecord$ = this._fr.createRevenueRecord(this.newRevenueRecord).pipe(tap(res => {
      this.showCreateRecordModal = false;
      this._fs.success("Revenue Created Successfully")
      this.revenueRecords$ = this._fr.getCompanyRevenueRecords(this.companyId).pipe(tap(res => {
        this.revenueRecords = res
        this.newRevenueRecord = { description: "", value: 0 ,year:0,companyId:this.companyId}
        this.updateRecordsByYear(this.currentFinancialRecord.year)
      }))
    }))
  }

  createCostOfSalesRecord() {
    this.newCostOfSalesRecord.companyId = this.companyId
    this.createCostOfSaleRecord$ = this._fr.createCostOfSaleRecord(this.newCostOfSalesRecord).pipe(tap(res => {
      this.showCreateCostOfSalesModal = false;
      this._fs.success("Cost Of Sale Created Successfully")
      this.costOfSalesRecords$ = this._fr.getCompanyRCostOfSaleRecords(this.companyId).pipe(tap(res => {
        this.costOfSalesRecords = res
        this.newCostOfSalesRecord = { description: "", value: 0 ,year:0,companyId:this.companyId}
        this.updateRecordsByYear(this.currentFinancialRecord.year)
      }))
    }))
  }


  addRevenueRecord() {
    this.newRevenueRecord = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : this.newFinancialRecord.year ? this.newFinancialRecord.year : 0,companyId:this.companyId};
    this.showCreateRecordModal = true;
  }

  addCostOfSalesRecord(){
    this.newCostOfSalesRecord = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : this.newFinancialRecord.year ? this.newFinancialRecord.year  : 0,companyId:this.companyId};
    this.showCreateCostOfSalesModal = true;
  }

  addOpexRecord() {
    this.newOpexRecord = { description: "", value: 0 ,year:this.currentFinancialRecord?.year ? this.currentFinancialRecord?.year : this.newFinancialRecord.year ? this.newFinancialRecord.year : 0,companyId:this.companyId};
    this.showCreateOpexModal = true;
  }

  onToggleEdit(){
    this.edit_mode = false
  }

  onToggleView(){
    this.edit_mode = true
  }

  createFinancialModal: boolean = false;

  addFinancialRecord() {
    this.edit_mode = true
    this.createFinancialModal = true
  }


  goToYear(year: number) {
    this._router.navigate([`business/balance-sheet/year/${year}`]);
  }

  newFinancialRecord: FinancialInfoRecordsPayload = {
    companyId: this.companyId,
    year: 0,
    revenues: [],
    opex: [],
    costOfSales:[],
    amorDep:0,
    interests:0,
    taxes:0
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
  costOfSalesData:any[] = []
  combinedData:any[] = []

  reversedTableData: any[] = [];

  years: number[] = [];

  transformData() {
    this.years = Array.from(
      new Set(this.financialInfoRecords.map((item) => item.year))
    ).sort((a, b) => a - b); // Sort numerically in descending order
  
    // Prepare rows with descriptions and values
    const opex_rows: any = {};
    const revenue_rows: any = {};
    const cost_of_sales_rows: any = {};
    const cost_of_sales_totals: any = {};
    const revenue_totals: any = {}; 
    const opex_totals: any = {};
    const taxes_row: any = { description: 'Taxes' };
    const ebit_row: any = { description: 'EBIT' };

    const amortisation_row: any = { description: 'Depreciation and Amortisation' };
    const interests_row: any = { description: 'Interests' };
    const profit_before_tax: any = { description: 'Profit before Tax' };
    const net_profit: any = { description: 'Net Profit' };

    const ebitda_row: any = { description: 'EBITDA' };
    const profitBeforeTax: any = { description: 'Profit before Tax'};
    const grossProfit: any ={description: 'Gross Profit'};
    const netProfit: any = { description: 'Net Profit'};
    const grossMargin: any = {description:'Gross Margin'};
    const ebitdaMargin : any =  {description:'EBITDA Margin'};
  
    
  
    this.financialInfoRecords.forEach((entry) => {
      const year = entry.year;
  
      // Handle revenues
      entry.revenues.forEach((rev: any) => {
        if (!revenue_rows[rev.description]) {
          revenue_rows[rev.description] = { description: rev.description };
        }
        revenue_rows[rev.description][year] = rev.value;
  
        // Add to revenue totals
        revenue_totals[year] = (revenue_totals[year] || 0) + rev.value;
      
      });

      entry.costOfSales.forEach((rev: any) => {
        if (!cost_of_sales_rows[rev.description]) {
          cost_of_sales_rows[rev.description] = { description: rev.description };
        }
        cost_of_sales_rows[rev.description][year] = rev.value;
  
        // Add to revenue totals
        cost_of_sales_totals[year] = (cost_of_sales_totals[year] || 0) + rev.value;
      
      });
  
  
      // Handle opex
      entry.opex.forEach((opex: any) => {
        if (!opex_rows[opex.description]) {
          opex_rows[opex.description] = { description: opex.description };
        }
        opex_rows[opex.description][year] = opex.value;
        opex_totals[year] = (opex_totals[year] || 0) + opex.value;

      });
  
      ebitda_row[year] = entry.ebitda;
      amortisation_row[year] = entry.amorDep
      ebit_row[year] = entry.ebit;
      interests_row[year] = entry.interests
      profit_before_tax[year] = 0
      taxes_row[year] = entry.taxes;    
      net_profit[year] = entry.netProfit
      profitBeforeTax[year] = entry.profitBeforeTax;
      grossProfit[year] = entry.grossProfit;
      netProfit[year] = entry.netProfit;
      grossMargin[year] = entry.grossMargin ;
      ebitdaMargin[year] = entry.ebitdaMargin ;

    });
  
    // Add total revenues row
    revenue_rows["Total Revenue"] = { description: "Total Revenue", ...revenue_totals };
    opex_rows["Total Operating Expenses"] = { description: "Total Operating Expenses", ...opex_totals };
    cost_of_sales_rows["Total Cost Of Sales"] = {description: "Total Cost Of Sales",...cost_of_sales_totals}

  
    // Convert rows object to array for PrimeNG table
    this.opexData = Object.values(opex_rows);
    this.revenueData = Object.values(revenue_rows);
    this.costOfSalesData = Object.values(cost_of_sales_rows)

    this.opexData.push(grossMargin,ebitda_row,ebitdaMargin,amortisation_row,ebit_row,interests_row,profit_before_tax,taxes_row,net_profit);
  }
  
















  saveUpdatesFinancial() {
    const extractedObject: UpdateFinancialRecords = {
      id: this.currentFinancialRecord.id,
      year: this.currentFinancialRecord.year, // Override year as per requirement
      status: this.currentFinancialRecord.status,
      notes: this.currentFinancialRecord.notes, // `null` if explicitly required
      revenues: this.financialForm.value.revenues,
      opex: this.financialForm.value.opex,
      companyId: this.companyId,
      costOfSales:this.financialForm.value.costOfSales,
      amorDep: Number(this.financialForm.value.amorDep),
      interests:Number(this.financialForm.value.interests),
      taxes:Number(this.financialForm.value.taxes)
    };


    this.UpdateFinancialInfoRecord$ = this._fr.updateFinancialRecord(extractedObject).pipe(tap(res => {
      this._fs.success("Financial Records Updated Successfully")
      this.financialInfoRecords$ = this._fr.getAllCompanyFinancialRecords(this.companyId).pipe(tap(res => {
        this.financialInfoRecords = res
        this.showFinancialModal = false;
        this.transformData();

        this.update_financial_info = true

      }))
    }))
  }

  editReports(){
    this.update_financial_info = false
  }

  unEditReports(){
    this.update_financial_info = true
  }


  handleYearClick(year: number,view?:boolean) {
    this.updateRecordsByYear(year)
    const foundRecord = this.financialInfoRecords.find(record => record.year === year);
    if (foundRecord) {
      if(view){
        this.showModalFuncFinancial(foundRecord, 'view_financial_info');
      }else{
        this.showModalFuncFinancial(foundRecord, 'update_financial_info');
      }
    } else {
      console.error('Record not found for year:', year);
    }
  }


  filteredRevenueRecords: RevenueRecords[] = [];
  filteredOpexRecords: OpexRecords[] = [];
  filteredCostOfSalesRecords: OpexRecords[] = [];


  updateRecordsByYear(year: number) {   
    this.filteredOpexRecords = this.opexRecords.filter(record => +record.year === +year);
    this.filteredRevenueRecords = this.revenueRecords.filter(record => +record.year === +year);
    this.filteredCostOfSalesRecords = this.costOfSalesRecords.filter(record => +record.year === +year)
  }
  



  exportRecord() {
    if (this.financials_content) {
      const contentElement = this.financials_content.nativeElement;
      this._pdfService.generatePDF2(contentElement, "FINANCIAL REPORT FOR");
    } else {
      console.error('Financial content element is not available.');
    }
  }
}
