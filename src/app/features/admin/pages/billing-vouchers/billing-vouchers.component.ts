import { Component, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing-vouchers',
  standalone: true,
  imports: [AdminUiContainerComponent, TableModule, PaginatorModule, NumberAbbriviationPipe, TimeAgoPipe, CommonModule],
  templateUrl: './billing-vouchers.component.html',
  styleUrl: './billing-vouchers.component.scss'
})
export class BillingVouchersComponent {
  first: number = 0;
  rows: number = 10;
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  private _router =inject(Router)
  vouchers =[]

  cols =[
    { field: 'code', header: 'Code' },
    { field: 'percentageDiscount', header: 'Discount' },
    { field: 'maxUsers', header: 'Max Users' },
    { field: 'users', header: 'Uses' },
    { field: 'rules', header: 'Rules' },
    { field: 'createdAt', header: 'Created' },
    { field: 'expires', header: 'Expires' },
    { field: 'actions', header: 'Actions' }
  ]

  bookings$ =new Observable<any>();

  getVouchers(page: number =1, limit:number =10){
    // this.bookings$ =this._bookingService.getBookings(page, limit).pipe(tap(bookings =>{
    //   this.bookings =bookings.data;
    //   this.updateDisplayedData();
    //   this.rowsCount =bookings.total;
    // }))
  }

  ngAfterViewInit(): void {
    this.getVouchers();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getVouchers(this.currentPage , this.rows);
  }

  removeVoucher(voucherId:number){
    // this.delete$ =this._confirmationService.confirm(`Are you sure? This action cannot be undone`).pipe(switchMap(confirmation =>{
    //   if(confirmation){
    //     return this._bookingService.deleteBooking(voucherId).pipe(tap(_ =>{
    //       this.getVouchers(this.currentPage, this.rows);
    //     }));
    //   }
    //   return EMPTY;
    // }))
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
}
