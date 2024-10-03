import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { InterestingBusinessComponent } from '../../components/InterestingBusiness/interestingBusiness.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    InterestingBusinessComponent

  ],
  templateUrl: './interestingBusiness.component.html',
  styleUrl: './interestingBusiness.component.scss'
})
export class InterstingBusinesComponent {
  links = INVESTOR_DASHBOARD_LINKS
}
