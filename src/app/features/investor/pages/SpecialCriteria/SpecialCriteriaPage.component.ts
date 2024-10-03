import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { SpecialCriteriaComponent } from '../../components/specialCriteria/specialCriteria.component';
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';


@Component({
  selector: 'investor-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    SpecialCriteriaComponent
  ],
  templateUrl: './SpecialCriteriaPage.component.html',
  styleUrl: './SpecialCriteriaPage.component.scss'
})
export class SpecialCriteriaPage {
  links = INVESTOR_DASHBOARD_LINKS
}
