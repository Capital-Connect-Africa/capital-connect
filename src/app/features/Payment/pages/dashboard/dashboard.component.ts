import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { PaymentComponent } from "../../components/Payment.component";
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'booking-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    PaymentComponent,
    AdvertisementSpaceComponent,
    NavbarComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  hidden =true;
  toggle_hidden() {
    this.hidden = !this.hidden;
  }

  links = BusinessLinks

  // links =[
  //   {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
  //   {label: 'Plans', href: '/business/plans', exact: false, icon: 'paid'},
  //   {label: 'My business', href: '/business/my-business', exact: false, icon: 'business_center'},
  //   // {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'}

  // ]
}
