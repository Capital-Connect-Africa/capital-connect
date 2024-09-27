import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { InterestingBusinessComponent } from '../../components/InterestingBusiness/interestingBusiness.component';
import { ConnectionRequestsComponent } from "../../components/ConnectionRequests/ConnectionRequests.component";
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

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
  links = INVESTOR_DASHBOARD_LINKS
  // links = [
  //   { label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view' },
  //   { label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune' },
  //   { label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public' },
  //   { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },


  //   // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  // ]
}