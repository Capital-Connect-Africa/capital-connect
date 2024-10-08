import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Payment } from '../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { UserStatisticsService } from '../../services/user.statistics.service';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { PaymentsService } from '../../services/payments.service';
import { ConfirmationService } from '../../../../core';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [AdminUiContainerComponent, CommonModule, TableModule, NumberAbbriviationPipe, TimeAgoPipe, PaginatorModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  first: number = 0;
  rows: number = 10;
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  filteredPayments: Payment[] = [];
  private _confirmationService =inject(ConfirmationService)
  private _paymentsService =inject(PaymentsService);
  private _statsService =inject(UserStatisticsService);
  payments: Payment[] =[];
  cols =[
    { field: 'id', header: 'PID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'description', header: 'Reason' },
    { field: 'actions', header: 'Actions' },
  ]

  payments$ =new Observable<any>()

  getPayments(page: number =1, limit:number =10){
    this.payments$ =this._paymentsService.getPayments(page, limit).pipe(switchMap(payments =>{
      return this._statsService.getPaymentStats().pipe(tap(res =>{
        this.rowsCount =Object.values(res).reduce((acc:number, curr:number) => acc + curr, 0);
        this.payments =payments;
        this.updateDisplayedData();
      }))
    }))
  }

  ngAfterViewInit(): void {
    this.getPayments();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getPayments(this.currentPage , this.rows);
  }

  removePayment(paymentId:number){
    this.delete$ =this._confirmationService.confirm(`Remove payment ${paymentId}?`).pipe(switchMap(confirmation =>{
      if(confirmation){
        return this._paymentsService.deletePayment(paymentId).pipe(tap(res =>{
          this.getPayments(this.currentPage, this.rows);
        }))
      }
      return EMPTY;
    }))
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.payments;
    const start = this.table.first??0;
    const end = start + (this.table.rows??this.rows);
    this.showingRows = data.slice(start, end).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }
}
