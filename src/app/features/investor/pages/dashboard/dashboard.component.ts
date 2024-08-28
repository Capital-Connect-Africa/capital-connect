import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {MainComponent} from "../../components/dashboard/main/main.component";

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
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'},


      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}
