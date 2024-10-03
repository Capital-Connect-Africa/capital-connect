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
}