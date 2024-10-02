import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/main/main/main.component";
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { Router } from '@angular/router';
import { BusinessLinks } from '../../../../core/utils/business.links';

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
  links = BusinessLinks
  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
