import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { InvestorPageComponent } from '../../components/InvestorProfile/investor-page/investor-page.component';


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
export class InvestorPage{
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'}
      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}
