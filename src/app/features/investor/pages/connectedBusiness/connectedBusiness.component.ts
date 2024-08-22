import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
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
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'}
      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}
