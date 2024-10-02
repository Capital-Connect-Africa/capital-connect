import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {BookingComponent} from "../../components/my-bookings/main/booking.component";
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    BookingComponent,
    SidenavComponent
  ],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  links =BusinessLinks
}
