import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {BookingComponent} from "../../components/my-bookings/main/booking.component";

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
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},

  ]
}
