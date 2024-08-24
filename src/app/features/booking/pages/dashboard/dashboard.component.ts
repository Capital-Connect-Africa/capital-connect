import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {MainComponent} from "../../components/main/main.component";

@Component({
  selector: 'booking-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MainComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  hidden =true;
  // links =[
  //   // {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
  //   // {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
  //   // {label: 'My business', href: '/business/my-business', exact: false, icon: 'business_center'}
  // ]
  toggle_hidden() {
    this.hidden = !this.hidden;
  }

  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'}

  ]
}
