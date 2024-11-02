import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TimeAgoPipe } from "../../../core/pipes/time-ago.pipe";
import { NumberAbbriviationPipe } from '../../../core/pipes/number-abbreviation.pipe';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Payment } from '../../interfaces/Billing';
import { Observable, tap } from 'rxjs';
import { BillingService } from '../../../features/billing/services/billing.service';

@Component({
  selector: 'app-user-transaction-history',
  standalone: true,
  imports: [CommonModule, TableModule, TimeAgoPipe, NumberAbbriviationPipe, PaginatorModule],
  templateUrl: './user-transaction-history.component.html',
  styleUrl: './user-transaction-history.component.scss'
})
export class UserTransactionHistoryComponent {
  payments$ =new Observable<any>();
  payments: Payment[] =[];
  cols =[
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'description', header: 'Reason' },
  ]
  first: number = 0;
  rows: number = 5;
  total: number =0;
  currentPage:number =1;
  private _billingService =inject(BillingService);

  getPayments(page: number =1, limit:number =5){
    this.payments$ =this._billingService.getPaymentHistory(page, limit).pipe(tap(res =>{
      this.total =res.total;
      this.payments =res.payments;
    }))
  }

  ngOnInit(): void {
    this.getPayments();
  }

  handlePageChange(event:PaginatorState){
    this.first =event.first as number;
    this.currentPage =(event.page as number) +1;
    this.getPayments(this.currentPage);
  }

}
