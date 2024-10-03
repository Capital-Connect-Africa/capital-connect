import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MatchedBusinessComponent } from '../../components/MatchedBusiness/matchedBusiness.component';
import { GlobalSearchComponent } from "../../components/GlobalSearch/globalSearch.component";
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MatchedBusinessComponent,
    GlobalSearchComponent
  ],
  templateUrl: './GlobalCompanySearch.component.html',
  styleUrl: './GlobalCompanySearch.component.scss'
})
export class GlobalCompanySearchComponnent {
  links = INVESTOR_DASHBOARD_LINKS
}
