import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/main/main/main.component";
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { Router } from '@angular/router';
import { BusinessLinks, BusinessLinkService } from '../../../../core/utils/business.links';
import { Subscription } from 'rxjs';
import { FeatureFlagsService } from '../../../../core/services/FeatureFlags/feature-flags.service';

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
    //Services
    private _ff = inject(FeatureFlagsService)

    //booleans
    billing_enabled: boolean = false
  
    //vars
    private flagSubscription: Subscription | undefined;

  constructor(){
    const profileId = sessionStorage.getItem('profileId');
    if (profileId) {
      this._router.navigate(['/investor/investor-page']);
    }
  }


  private _bs = inject(BusinessLinkService)

  private _authStateService =inject(AuthStateService)
  hidden = true;
  links = BusinessLinks

  // links = this._bs.getBusinessLinks(this.billing_enabled);


  toggle_hidden() {
    this.hidden = !this.hidden;
  }
}
