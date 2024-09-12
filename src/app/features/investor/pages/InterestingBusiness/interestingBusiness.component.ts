import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { InterestingBusinessComponent } from '../../components/InterestingBusiness/interestingBusiness.component';

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
  links = [
    { label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view' },
    { label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune' },
    { label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public' },
    { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },


    // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
  ]
}
