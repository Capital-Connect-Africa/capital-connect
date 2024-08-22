import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/main/main/main.component";
import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'profile-dashboard',
  standalone: true,
  imports: [
    SidenavComponent,
    MainComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _authStateService =inject(AuthStateService)
  hidden = true;
  links = [
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},
    {label: 'Dashboard', href: `${this._authStateService.userIsInvestor? '/investor': this._authStateService.userIsAdmin? '/dashboard': this._authStateService.userIsUser? '/business':''}`, exact: true, icon: 'grid_view'},
  ]
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
