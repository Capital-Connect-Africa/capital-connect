import { Component } from '@angular/core';
import { MainComponent } from "../../components/dashboard/main/main.component";
import { SidenavComponent } from '../../../../core';

@Component({
  selector: 'business-dashboard',
  standalone: true,
  imports: [SidenavComponent, MainComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  hidden =true;
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},

  ]
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
