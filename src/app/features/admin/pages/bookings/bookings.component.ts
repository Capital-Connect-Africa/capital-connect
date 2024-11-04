import { Component, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../shared/interfaces/Billing';
import { UserStatisticsService } from '../../services/user.statistics.service';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation.service';
import { BookingsService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule, TimeAgoPipe, NumberAbbriviationPipe, PaginatorModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {
  first: number = 0;
  rows: number = 10;
  showingRows =0;
  currentPage:number =1;
  delete$ =new Observable();
  rowsCount:number =this.rows;
  @ViewChild('dt') table!: Table;
  private _router =inject(Router);
  private _bookingService =inject(BookingsService);;
  private _statsService =inject(UserStatisticsService);
  private _confirmationService =inject(ConfirmationService);
  bookings: Booking[] =[];

  cols =[
    { field: 'id', header: 'Event ID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'actions', header: 'Actions' }
  ]

  bookings$ =new Observable<any>();

  getBookings(page: number =1, limit:number =10){
    this.bookings$ =this._bookingService.getBookings(page, limit).pipe(tap(bookings =>{
      this.bookings =bookings.data;
      this.updateDisplayedData();
      this.rowsCount =bookings.total;
    }))
  }

  ngAfterViewInit(): void {
    this.getBookings();
  }

  onPageChange(event:PaginatorState){
    this.currentPage =(event.page || 0) +1;
    this.first =event.first || this.first;
    this.rows =event.rows || this.rows;
    this.getBookings(this.currentPage , this.rows);
  }

  removeBooking(bookingId:number){
    this.delete$ =this._confirmationService.confirm(`Are you sure? This action cannot be undone`).pipe(switchMap(confirmation =>{
      if(confirmation){
        return this._bookingService.deleteBooking(bookingId).pipe(tap(_ =>{
          this.getBookings(this.currentPage, this.rows);
        }));
      }
      return EMPTY;
    }))
  
  }


  openBooking(bookingId:number){
    this._router.navigateByUrl(`/bookings/${bookingId}`)
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.bookings;
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
