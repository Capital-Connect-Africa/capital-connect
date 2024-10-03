import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { MainComponent } from "../../../business/components/subscription/main/main.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SubscriptionComponent as Billing} from "../../components/subscription/subscription.component";

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [SidenavComponent, MainComponent, NavbarComponent, Billing],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'Plans', href: '/business/plans', exact: false, icon: 'paid'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'Special Criteria', href: '/business/special-criteria', exact: false, icon: 'contact_support'},
    // {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},

  ]
}
