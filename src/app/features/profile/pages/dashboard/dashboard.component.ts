import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/main/main/main.component";
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { Router } from '@angular/router';

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
  private _router = inject(Router)

  constructor(){
    const profileId = sessionStorage.getItem('profileId');
    if (profileId) {
      this._router.navigate(['/investor/investor-page']);
    }
  }


  private _authStateService =inject(AuthStateService)
  hidden = true;
  links = [
    {label: 'Dashboard', href: `${this._authStateService.userIsInvestor? '/investor': this._authStateService.userIsAdmin? '/dashboard': this._authStateService.userIsUser? '/business':''}`, exact: true, icon: 'grid_view'},
    {label: 'Plans', href: '/business/plans', exact: false, icon: 'paid'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},
    {label: 'Special Criteria', href: '/business/special-criteria', exact: false, icon: 'contact_support'},
  ]
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
