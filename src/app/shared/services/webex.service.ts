import { Injectable ,inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../core/http/base/base.http.service';
import { CreateBookingRequest, CreateBookingResponse, Meeting } from '../interfaces/booking';
import { BASE_URL } from '../../core';
import { Router } from '@angular/router';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { Booking } from '../interfaces/booking';


@Injectable({
  providedIn: 'root'
})
export class WebExService extends BaseHttpService {
  authStateService = inject(AuthStateService);
  token = this.authStateService.authToken;
  constructor(private _httpClient: HttpClient, private router: Router) {
    super(_httpClient);
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': `Bearer ${this.token}`
  });


  createMeeting(request: unknown): Observable<unknown> {
    return this.create(`${BASE_URL}/webex/create`, request, this.headers) as Observable<unknown>;
  }

  getMeeting(id: string): Observable<unknown> {
    return this.read(`${BASE_URL}/webex/${id}`, this.headers) as Observable<unknown>;
  }

}