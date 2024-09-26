import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/dashboard/main/main.component";
import { INVESTOR_DASHBOARD_LINKS } from '../../../../shared/routes/investor-dashboard-routes';

@Component({
  selector: 'investor-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MainComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  links = INVESTOR_DASHBOARD_LINKS
  // links = [
  //   { label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view' },
  //   { label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune' },
  //   { label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public' },
  //   { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },


  //   { label: 'Analytics', href: '/dashboard-investor', exact: false, icon: 'grid_view' },
  //   { label: 'Companies', href: '/organization/list-investors', exact: false, icon: 'apartment' },
  //   { label: 'Investors', href: '/business-investors-investors', exact: false, icon: 'paid' },



  //   // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  // ]
}
