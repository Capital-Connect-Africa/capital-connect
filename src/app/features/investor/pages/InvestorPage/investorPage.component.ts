import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { InvestorPageComponent } from '../../components/InvestorProfile/investor-page/investor-page.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';


@Component({
  selector: 'investor-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    InvestorPageComponent
  ],
  templateUrl: './investorPage.component.html',
  styleUrl: './investorPage.component.scss'
})
export class InvestorPage {
  links = INVESTOR_DASHBOARD_LINKS
}
