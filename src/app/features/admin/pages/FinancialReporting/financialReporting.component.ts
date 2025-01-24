import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Plan } from '../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { SubscriptionsService } from '../../services/subscriptions.service';
import { ConfirmationService } from '../../../../core';
import { Router } from '@angular/router';
import { CheckExpiryPipe } from '../../../../core/pipes/check-expiry.pipe';
import { FinancialReportingService } from '../../../business/components/FinancialReporting/FinancialReporting.service';
import { FeedbackService } from '../../../../core';
import { AddNotesToFinancialecords, FinancialInfoRecords } from '../../../questions/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, AdminUiContainerComponent, CommonModule, TableModule, NumberAbbriviationPipe, TimeAgoPipe, CheckExpiryPipe, PaginatorModule, ModalComponent],
  templateUrl: './financialReporting.component.html',
  styleUrl: './financialReporting.component.scss'
})
export class FinancialReportingComponent {
  //booleans
  view_financial_info = false;
  update_financial_info = false;
  showFinancialModal = false


  //forms
  financialForm!: FormGroup;

  //services
  private _fr = inject(FinancialReportingService)
  private _fs = inject(FeedbackService)
  private _fb = inject(FormBuilder)


  //vars
  financialInfoRecords: FinancialInfoRecords[] = []
  title!: string;
  helperText!: string;
  statusOptions = [
    { label: 'APPROVED', value: 'approve' },
    { label: 'REVOKE', value: 'revoke' },   
  ];
  


  //financial info
  financialInfoRecords$ = new Observable<unknown>()
  addNotesToFinancialInfoRecord$ = new Observable<unknown>()
  UpdateFinancialInfoRecordStatus$ = new Observable<unknown>()


  first: number = 0;
  rows: number = 10;
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  filteredPlans: Plan[] = [];
  private _router =inject(Router);
  private _subscriptionsService =inject(SubscriptionsService);
  private _statsService =inject(UserStatisticsService);
  private _confirmationService =inject(ConfirmationService);
  plans: Plan[] =[];
  cols =[
    { field: 'subscriber', header: 'Subscriber' },
    { field: 'package', header: 'Package' },
    { field: 'price', header: 'Price' },
    { field: 'status', header: 'Status' },
    { field: 'date_subscribed', header: 'Purchased' },
    { field: 'action', header: 'Actions'}
  ];

  plans$ =new Observable<any>()

  ngOnInit(){
    this.financialForm = this._fb.group({
      revenues: [[]], // Empty array by default
      opex: [[]], // Empty array by default
    });



    this.financialInfoRecords$ = this._fr.getAllFinancialRecords().pipe(tap(res => {
      this.financialInfoRecords = res
    }))
  }

  getSubscriptions(page: number =1, limit:number =10){
    this.plans$ =this._subscriptionsService.getSubscriptions(page, limit).pipe(tap(plans =>{
      this.plans =plans.plans;
      this.rowsCount =plans.total
      this.updateDisplayedData();
    }))
  }

  ngAfterViewInit(): void {
    this.getSubscriptions();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getSubscriptions(this.currentPage , this.rows);
  }

  updateSubscriptionStatus(planId:number, isActive:boolean){
    this.delete$ =this._confirmationService.confirm(`Do you want to ${isActive? 'deactivate': 'activate'} plan?`).pipe(switchMap(confirmation =>{
      if(confirmation){
        return this._subscriptionsService.updateSubscriptionStatus(planId, !isActive).pipe(tap(_ =>{
          this.getSubscriptions(this.currentPage, this.rows);
        }))
      }
      return EMPTY;
    }))
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.plans;
    const start = this.table.first??0;
    const end = start + (this.table.rows??this.rows);
    this.showingRows = data.slice(start, end).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }

  openSubscription(planId:number){
    this._router.navigateByUrl(`/subscriptions/${planId}`)
  }




  patchFormData(data: any): void {
    // Patch values into the form
    this.financialForm.patchValue({
      revenues: data.revenues.map((rec: { id: any; }) => rec.id),
      opex: data.opex.map((rec: { id: any; }) => rec.id),
    });
  }

  currentFinancialRecord!: FinancialInfoRecords
  showModalFuncFinancial(record: any, action: string) {
    this.currentFinancialRecord = { ...record };

    this.patchFormData({
      revenues:this.currentFinancialRecord.revenues,
      opex:this.currentFinancialRecord.opex
    })


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


  saveUpdatesFinancial(){
    let notes:AddNotesToFinancialecords = {
      notes:this.currentFinancialRecord.notes
    }
    this.addNotesToFinancialInfoRecord$ = this._fr.addNotesToFinancialRecords(notes,this.currentFinancialRecord.id).pipe(tap(res=>{
      this._fs.success("Notes added to the financial record successfully")
    }))


    this.UpdateFinancialInfoRecordStatus$ = this._fr.rejectApproveFinancialRecord(this.currentFinancialRecord.id,this.currentFinancialRecord.status).pipe(tap(res=>{
      this._fs.success("Status added to the financial record successfully")
    }))

    this.showFinancialModal = false;

    this.financialInfoRecords$ = this._fr.getAllFinancialRecords().pipe(tap(res => {
      this.financialInfoRecords = res
    }))
    
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'rejected':
        return 'status-banner rejected';
      case 'pending':
        return 'status-banner pending';
      case 'approved':
        return 'status-banner approved';
      default:
        return 'status-banner';
    }
  }
  
}
