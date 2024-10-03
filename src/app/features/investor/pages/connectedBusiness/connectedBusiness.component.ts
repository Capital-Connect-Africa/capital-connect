import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { ConnectedBusinessComponent } from '../../components/connectedBusiness/connectedBusiness.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    ConnectedBusinesComponent,
    ConnectedBusinessComponent
  ],
  templateUrl: './connectedBusiness.component.html',
  styleUrl: './connectedBusiness.component.scss'
})
export class ConnectedBusinesComponent {
  links = INVESTOR_DASHBOARD_LINKS
}
