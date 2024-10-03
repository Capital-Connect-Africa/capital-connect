import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MatchedBusinessComponent } from '../../components/MatchedBusiness/matchedBusiness.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MatchedBusinessComponent
  ],
  templateUrl: './matchedBusiness.component.html',
  styleUrl: './matchedBusiness.component.scss'
})
export class MatchedBusinesComponent {
  links = INVESTOR_DASHBOARD_LINKS
}
