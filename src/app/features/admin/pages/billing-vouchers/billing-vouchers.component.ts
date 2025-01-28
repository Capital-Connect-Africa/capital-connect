import { Component, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { Observable, tap } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { Voucher, VoucherFormData, VoucherType } from '../../../../shared/interfaces/voucher.interface';
import { Rule } from '../../../../shared/interfaces/rule.interface';
import { BillingVoucherService } from '../../services/billing-voucher.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { WelcomeUserPipe } from "../../../../core/pipes/welcome-user.pipe";
@Component({
  selector: 'app-billing-vouchers',
  standalone: true,
  imports: [AdminUiContainerComponent, TableModule, ReactiveFormsModule, PaginatorModule, MultiSelectModule, CalendarModule, DropdownModule, TimeAgoPipe, CommonModule, ModalComponent, WelcomeUserPipe],
  templateUrl: './billing-vouchers.component.html',
  styleUrl: './billing-vouchers.component.scss'
})
export class BillingVouchersComponent {
  // first: number = 0;
  rows: number = 10;
  rowsCount:number =0;
  currentPage:number =1;
  
  delete$ =new Observable();
  updateVoucher$ =new Observable();
  createVoucher$ =new Observable();

  @ViewChild('dt') table!: Table;
  private _router =inject(Router);
  private _fb =inject(FormBuilder);
  private _userAuthState =inject(AuthStateService);

  visible =false;
  rules:Rule[] =[];
  vouchers:Voucher[] =[];
  voucherToBeEdited:Voucher | null =null;
  currentUsersFirstName =this._userAuthState.currentUserProfile().firstName;

  cols =[
    { field: 'code', header: 'Code' },
    { field: 'percentageDiscount', header: 'Discount' },
    { field: 'maxAmount', header: 'Max Amount' },
    { field: 'maxUses', header: 'Max Users' },
    { field: 'users', header: 'Current Uses' },
    { field: 'createdAt', header: 'Created' },
    { field: 'expires', header: 'Expires' },
    { field: 'actions', header: 'Actions' }
  ]

  today: Date =new Date();
  defaultDate: Date =new Date();

  end =0;
  start =0;
  vouchersCount:number =0;
  vouchersShowingCount =0;
  heading ='CREATE VOUCHER';
  helperText ='Enter new voucher details';
  rules$ =new Observable<Rule[]>();
  vouchers$ =new Observable();

  private _voucherService =inject(BillingVoucherService);

  getVouchers(page: number =1, limit:number =10){
    this.vouchers$ =this._voucherService.getBillingVouchers(page, limit).pipe(tap(payload =>{
      this.vouchers =payload.data;
      this.rowsCount =payload.total_count;
      this.updateDisplayedData();
    }))
  }


  ngAfterViewInit(): void {
    this.getVouchers();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =Number(event.page) +1;
    this.rows =event.rows || this.rows;
    this.getVouchers(this.currentPage , this.rows);
  }

  editVoucher(voucherId:number){
    this.voucherForm.reset();
    const voucherToBeEdited =this.vouchers.find(voucher =>voucher.id === voucherId) as Voucher;
    if(voucherToBeEdited){
      this.heading ='UPDATE VOUCHER';
      this.helperText =`Update details for voucher ${voucherToBeEdited.code}`;
      this.voucherToBeEdited =voucherToBeEdited
      this.defaultDate =new Date(voucherToBeEdited.expiresAt)
      this.voucherForm.patchValue({
        maxUses: `${voucherToBeEdited.maxUses}`,
        maxAmount: `${voucherToBeEdited.maxAmount}`,
        type: voucherToBeEdited.type,
        expiresAt: new Date(voucherToBeEdited.expiresAt),
        percentageDiscount: `${Number(voucherToBeEdited.percentageDiscount)}`
      })
    }
    this.visible =true;
  }

  removeVoucher(voucherId:number){
  //   this.delete$ =this._confirmationService.confirm(`Are you sure? This action cannot be undone`).pipe(switchMap(confirmation =>{
  //     if(confirmation){
  //       return this._bookingService.deleteBooking(voucherId).pipe(tap(_ =>{
  //         this.getVouchers(this.currentPage, this.rows);
  //       }));
  //     }
  //     return EMPTY;
  //   }))
  }


  openVoucher(voucherId:number){
    this._router.navigateByUrl(`/billing-vouchers/${voucherId}`)
  }

  updateDisplayedData() {
    const start = this.table.first ?? 0;
    const rows = this.table.rows ?? 10;
    const end = Math.min(start + rows, this.rowsCount);
    this.vouchersShowingCount = start + 1; 
    this.end = end;
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }

  showModal(){
    if(this.voucherToBeEdited){
      this.resetModal();
    }
    this.visible =true;
  }

  voucherType:{value: VoucherType, label: string}[] =[
    {
      label: 'Subscription Plans',
      value: VoucherType.subscriptionPlan
    },

    {
      label: 'Advisory Sessions',
      value: VoucherType.AdvisorySession
    }
  ]

  voucherForm =this._fb.group({
    rules: [[]],
    type: ['', [Validators.required]],
    maxUses: ['', [Validators.required]],
    maxAmount: ['', [Validators.required]],
    percentageDiscount: ['', [Validators.required]],
    expiresAt: [this.today, [Validators.required]]
  })

  saveVoucher(){
    if(this.voucherToBeEdited) return this.updateVoucher();
    const values =this.voucherForm.value as Partial<VoucherFormData>;
    this.createVoucher$ =this._voucherService.generateVoucher({
      ...values, 
      rules: values.rules || [],
    }).pipe(tap(res =>{
      this.getVouchers(this.currentPage, this.rows);
      this.resetModal();
    }))
  }

  updateVoucher(){
    const {expiresAt, maxAmount, maxUses, percentageDiscount, type} =this.voucherForm.value as Partial<VoucherFormData>;
    this.updateVoucher$ =this._voucherService.updateVoucher({
      expiresAt, type, 
      maxAmount: Number(maxAmount), 
      maxUses: Number(maxUses), 
      percentageDiscount: Number(percentageDiscount)}, 
      Number(this.voucherToBeEdited?.id)).pipe(tap(res =>{
      this.voucherToBeEdited =null;
      this.getVouchers(this.currentPage, this.rows);
      this.resetModal();
    }))
  }

  resetModal(){
    this.visible =false;
    this.voucherForm.reset();
    this.today =new Date();
    this.defaultDate =new Date();
    this.voucherToBeEdited =null;
    this.heading ='CREATE VOUCHER';
    this.helperText ='Enter new voucher details';
  }
}
