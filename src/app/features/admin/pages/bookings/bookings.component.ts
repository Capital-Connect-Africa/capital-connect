import { Component, inject } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../../shared/interfaces/Billing';
import { UserStatisticsService } from '../../services/user.statistics.service';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, TableModule, TimeAgoPipe, NumberAbbriviationPipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {
  private _bookingService =inject(UserStatisticsService);
  bookings: Booking[] =[];
  cols =[
    { field: 'id', header: 'Event ID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' }
  ]

  bookings$ =new Observable<any>()

  getBookings(page: number =1, limit:number =10){
    this.bookings$ =this._bookingService.getBookings(page, limit).pipe(tap(res =>{
      this.bookings =res;
    }))
  }

  ngOnInit(): void {
    this.getBookings();
  }
}
