import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { MatchedBusinessComponent } from '../../components/MatchedBusiness/matchedBusiness.component';

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
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'}
      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}
