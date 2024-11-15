import { Injectable ,inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../core/http/base/base.http.service';
import { BookingResponse, CreateBookingRequest, CreateBookingResponse } from '../interfaces/booking';
import { BASE_URL } from '../../core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Booking } from '../interfaces/booking';


@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseHttpService {
  authStateService = inject(AuthStateService);
  token = this.authStateService.authToken;
  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient);
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.token}`
  });


  createBooking(request: CreateBookingRequest): Observable<CreateBookingResponse> {
    return this.create(`${BASE_URL}/bookings`, request, this.headers) as Observable<CreateBookingResponse>;
  }

  goToCalendly(): void {
    const calendlyUrl = 'https://calendly.com/investor-eligibility/investor-preparedness';
    window.open(calendlyUrl, '_blank');
  }

  getBookings(page:number,limit:number) : Observable<BookingResponse>{
    const url =  `${BASE_URL}/bookings?page=${page}&limit=${limit}`;
    return this.read(url, this.headers) as unknown as Observable<BookingResponse>;
  }

}