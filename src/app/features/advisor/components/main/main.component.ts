import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdvisorUiContainerComponent } from "../admin-ui-container/advisor-ui-container.component";
import { Observable, tap } from 'rxjs';
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { TableModule } from 'primeng/table';
import { UserRoleFormatPipe } from '../../../../core/pipes/user-role-format.pipe';
import { Booking, Payment} from '../../../../shared/interfaces/Billing';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { BookingsService } from '../../services/booking.service';
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule,
    AdvisorUiContainerComponent,
    PieChartComponent,
    TableModule,
    UserRoleFormatPipe,
    NumberAbbriviationPipe,
    TimeAgoPipe,
    AdvertisementSpaceComponent,
    CommonModule,
    RouterModule
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})

export class MainComponent {
  //observables
  getMeeting$ = new Observable<unknown>()
  bookings$ = new Observable<any>();


  //services
  private _router = inject(Router);
  private _bookingService = inject(BookingsService);
  


  //vars
  subscriptions!: Record<string, number>;
  payments: Payment[] = [];
  bookings: Booking[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalItems: number = 0;



  navigateTo(path: string) {
    this._router.navigate([path]);
  }


  getBookings(page: number = 1, limit: number = 10) {
    this.bookings$ = this._bookingService.getBookings(page, limit).pipe(tap(bookings => {
      this.bookings = bookings.data;
      // this.updateDisplayedData();
      // this.rowsCount = bookings.total;
    }))
  }



  ngOnInit(): void {
    this.getBookings();
  }

  getMeeting(booking:Booking) {

    this._router.navigate([`/business/my-booking/${booking.calendlyEventId}/${booking.id}`]);

    // this._router.navigate([`/business/my-booking/${booking.calendlyEventId}`]);
  }

}
