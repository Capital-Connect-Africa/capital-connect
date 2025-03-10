import { Component, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Advisor, Booking } from '../../../../shared/interfaces/Billing';
import { UserStatisticsService } from '../../services/user.statistics.service';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { NumberAbbriviationPipe } from '../../../../core/pipes/number-abbreviation.pipe';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ConfirmationService } from '../../../../core/services/confirmation/confirmation.service';
import { BookingsService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormsModule } from '@angular/forms';
import { User } from '../../../users/models';
import { UsersHttpService } from '../../../users/services/users-http.service';
import { FeedbackService } from '../../../../core';
import { AdvisorService } from '../../../advisor/services/advisor-profile.service';
import { AdvisorProfile } from '../../../../shared/interfaces/advisor.profile';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminUiContainerComponent, TableModule, TimeAgoPipe, NumberAbbriviationPipe, PaginatorModule, ModalComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {
  //services
  private _router = inject(Router);
  private _bookingService = inject(BookingsService);;
  private _fs = inject(FeedbackService)
  private _confirmationService = inject(ConfirmationService);
  private _usersService = inject(UsersHttpService);
  private _advisorService = inject(AdvisorService);


  //vars
  first: number = 0;
  rows: number = 10;
  showingRows = 0;
  currentPage: number = 1;
  advisor!: AdvisorProfile
  users: User[] = [];
  advisors: AdvisorProfile[] = [];
  rowsCount: number = this.rows;
  @ViewChild('dt') table!: Table;
  bookings: Booking[] = [];

  //streams
  delete$ = new Observable();
  assignBooking$ = new Observable();
  bookings$ = new Observable<any>();
  users$ = new Observable<User[]>();
  advisors$ = new Observable<AdvisorProfile[]>();

  //booleans
  advisorModal: boolean = false


  cols = [
    { field: 'id', header: 'Event ID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'actions', header: 'Actions' }
  ]


  getBookings(page: number = 1, limit: number = 10) {
    this.bookings$ = this._bookingService.getBookings(page, limit).pipe(tap(bookings => {
      this.bookings = bookings.data;
      this.updateDisplayedData();
      this.rowsCount = bookings.total;
    }))
  }

  ngOnInit(): void {
    this.getBookings();
    this.advisors$ = this._advisorService.getAllAdvisorProfiles().pipe(
      tap(advisors => {
        this.advisors = advisors;
      })
    );


    this.users$ = this._usersService.getAllUsers().pipe(
      tap(users => {
        this.users = users;


        this.users = this.users
          .filter(user => user.roles && user.roles === 'advisor')
          .map(user => ({
            ...user,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          }));

      })
    );

  }

  onPageChange(event: PaginatorState) {
    this.currentPage = (event.page || 0) + 1;
    this.first = event.first || this.first;
    this.rows = event.rows || this.rows;
    this.getBookings(this.currentPage, this.rows);
  }

  removeBooking(bookingId: number) {
    this.delete$ = this._confirmationService.confirm(`Are you sure? This action cannot be undone`).pipe(switchMap(confirmation => {
      if (confirmation) {
        return this._bookingService.deleteBooking(bookingId).pipe(tap(_ => {
          this.getBookings(this.currentPage, this.rows);
        }));
      }
      return EMPTY;
    }))

  }


  openBooking(bookingId: number) {
    this._router.navigateByUrl(`/bookings/${bookingId}`)
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.bookings;
    const start = this.table.first ?? 0;
    const end = start + (this.table.rows ?? this.rows);
    this.showingRows = data.slice(start, end).length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue.toLowerCase(), 'contains');
    this.updateDisplayedData();
  }


  currentBookingId!: number
  assignAdvisor(bookingId: number) {
    this.advisorModal = true
    this.currentBookingId = bookingId
  }

  saveAdvisor() {
    let data = {
      "userId":  this.advisor.user.id
    }

    this.assignBooking$ = this._bookingService.assignBookingToAdvisor(this.currentBookingId, data).pipe(tap(res => {
      this._fs.success("Advisor Assigned Successfully")
      this.getBookings();

    }),
      catchError(err => {
        this._fs.info(err.message);
        return of(null);
      })
    )

    this.advisorModal = false

  }

}
