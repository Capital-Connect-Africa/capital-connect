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
}
