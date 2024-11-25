import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../../core";
import { BusinessLinks } from '../../../../../core/utils/business.links';
import { MyBookingComponent } from '../../../components/my-bookings/main/my-booking/main/booking.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    MyBookingComponent,
    SidenavComponent
  ],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class BookingComponent {
  links =BusinessLinks
}
