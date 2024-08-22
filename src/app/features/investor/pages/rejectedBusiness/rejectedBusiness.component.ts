import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { RejectedBusinessComponent } from '../../components/rejectedBusiness/rejectedBusiness.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    RejectedBusinesComponent,
    RejectedBusinessComponent
],
  templateUrl: './rejectedBusiness.component.html',
  styleUrl: './rejectedBusiness.component.scss'
})
export class RejectedBusinesComponent {
    links =[
      {label: 'Dashboard', href: '/investor', exact: true, icon: 'grid_view'},
      {label: 'Profile', href: '/investor/onboarding', exact: false, icon: 'settings'}
      // {label: 'Settings', href: '/investor', exact: false, icon: 'settings'}
    ]
}
