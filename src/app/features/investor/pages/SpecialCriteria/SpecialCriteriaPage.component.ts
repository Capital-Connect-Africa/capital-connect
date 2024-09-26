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
  // links = [
  //   { label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view' },
  //   { label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune' },
  //   { label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public' },
  //   { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },

  //   // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  // ]
}
