import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { MainComponent } from "../../../business/components/subscription/main/main.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SubscriptionComponent as Billing} from "../../components/subscription/subscription.component";
import { BusinessLinks,BusinessLinkService } from '../../../../core/utils/business.links';
import { Subscription } from 'rxjs';
import { FeatureFlagsService } from '../../../../core/services/FeatureFlags/feature-flags.service';


@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [SidenavComponent, MainComponent, NavbarComponent, Billing],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent {
  // private _bs = inject(BusinessLinkService)
    //Services
    private _ff = inject(FeatureFlagsService)

    //booleans
    billing_enabled: boolean = false
  
    //vars
    private flagSubscription: Subscription | undefined;
    private _bs = new BusinessLinkService()

  
    links = this._bs.getBusinessLinks(this.billing_enabled);


  ngOnInit(): void {
    this._ff.initializeClient('subscription-businesses')

    this.billing_enabled = this._ff.getFeatureFlag('subscription-businesses',false)

    this.flagSubscription = this._ff.getFeatureFlagObservable().subscribe((flagValue) => {
      this.billing_enabled = flagValue;
      this.links = this._bs.getBusinessLinks(flagValue);

    });
  }


  // links =BusinessLinks
}
