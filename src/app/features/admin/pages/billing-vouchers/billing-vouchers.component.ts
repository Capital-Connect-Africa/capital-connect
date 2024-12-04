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
import { Rule, RuleFormData } from '../../../../shared/interfaces/rule.interface';
import { BillingVoucherService } from '../../services/billing-voucher.service';
import { RulesService } from '../../services/rule.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  first: number = 0;
  rows: number = 0; // set back to 10
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  createVoucher$ =new Observable();
  createRule$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  private _router =inject(Router);
  private _fb =inject(FormBuilder)
  private _userAuthState =inject(AuthStateService);

  currentUsersFirstName =this._userAuthState.currentUserProfile().firstName
  rules:Rule[] =[];
  vouchers:Voucher[] =[];
  visible =false;
  cols =[
    { field: 'code', header: 'Code' },
    { field: 'percentageDiscount', header: 'Discount' },
    { field: 'maxUses', header: 'Max Users' },
    { field: 'users', header: 'Uses' },
    { field: 'rules', header: 'Rules' },
    { field: 'createdAt', header: 'Created' },
    { field: 'expires', header: 'Expires' },
    { field: 'actions', header: 'Actions' }
  ]

  
  rules$ =new Observable<Rule[]>();
  vouchers$ =new Observable<Voucher[]>();

  private _rulesService =inject(RulesService);
  private _voucherService =inject(BillingVoucherService);

  getVouchers(page: number =1, limit:number =10){
    this.vouchers$ =this._voucherService.getBillingVouchers(page, limit).pipe(tap(vouchers =>{
      this.vouchers =vouchers
    }))
  }

  getRules(page: number =1, limit: number =10){
   this.rules$ = this._rulesService.getRules(page, limit, true).pipe(tap(rules =>{
    this.rules =rules
   }))
  }

  ngAfterViewInit(): void {
    this.getVouchers();
    this.getRules();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getVouchers(this.currentPage , this.rows);
  }

  editVoucher(voucherId:number){
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
    // const data = this.table.filteredValue || this.bookings;
    const start = this.table.first??0;
    const end = start + (this.table.rows??this.rows);
    // this.showingRows = data.slice(start, end).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }

  showModal(){
    this.visible =true
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
    expiresAt: ['', [Validators.required]]
  })

  ruleForm =this._fb.group({
    userPropery: ['', [Validators.required]],
    description: ['', [Validators.required]],
    operator: ['', [Validators.required]],
    value: ['', [Validators.required]],
  })

  saveVoucher(){
    const values =this.voucherForm.value as Partial<VoucherFormData>;
    this.createVoucher$ =this._voucherService.generateVoucher(values).pipe(tap(res =>{
      this.getVouchers(this.currentPage, this.rows);
    }))
  }

  saveRule(){
    const values =this.voucherForm.value as Partial<RuleFormData>;
    this.createRule$ =this._rulesService.createRule(values).pipe(tap(res =>{
      this.getRules();
    }))
  }
}
