import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { InterestingBusinessComponent } from '../../components/InterestingBusiness/interestingBusiness.component';
import { ConnectionRequestsComponent } from "../../components/ConnectionRequests/ConnectionRequests.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    InterestingBusinessComponent,
    ConnectionRequestsComponent
],
  templateUrl: './ConnectionRequests.component.html',
  styleUrl: './ConnectionRequests.component.scss'
})
export class ConnectionRequests {
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'},

      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}