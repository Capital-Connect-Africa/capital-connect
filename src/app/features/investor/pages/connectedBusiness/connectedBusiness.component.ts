import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { ConnectedBusinessComponent } from '../../components/connectedBusiness/connectedBusiness.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    ConnectedBusinesComponent,
    ConnectedBusinessComponent
  ],
  templateUrl: './connectedBusiness.component.html',
  styleUrl: './connectedBusiness.component.scss'
})
export class ConnectedBusinesComponent {
  links = [
    { label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view' },
    { label: 'Special Criteria', href: '/investor/special-criteria', exact: false, icon: 'tune' },
    { label: 'Global Search', href: '/investor/global-search', exact: false, icon: 'public' },
    { label: 'Profile', href: '/investor/investor-page', exact: false, icon: 'settings' },


  ]
}
