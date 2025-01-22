import { Component, inject, Input, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../../core/components/navbar/navbar.component";
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { AlertCardComponent } from '../../../../profile/components/alert-card/alert-card.component';
import { ProfileService } from '../../../../profile/services/profile.service';
import { RoutingService } from '../../../../../shared/business/services/routing.service';
import { tap } from 'rxjs';
import { SignalsService } from '../../../../../core/services/signals/signals.service';
import { Router, RouterModule } from '@angular/router';
import { InvestorProfile } from '../../../../../shared/interfaces/Investor';
import { InvestorScreensService } from '../../../services/investor.screens.service';
import { Profile } from '../../../../../shared/interfaces/profile.interface';
import { ReferralLinkComponent } from "../../../../../shared/components/referral-link/referral-link.component";

@Component({
  standalone: true,
  selector: 'app-investor-page',
  templateUrl: './investor-page.component.html',
  styleUrls: ['./investor-page.component.scss'],
  imports: [NavbarComponent,
    MatIcon,
    NavbarComponent,
    CommonModule,
    AlertComponent,
    AlertCardComponent,
    RouterModule, ReferralLinkComponent]
})
export class InvestorPageComponent implements OnInit {
  @Input() showBanner =false;
  private _profileService =inject(ProfileService);
  private _routingService =inject(RoutingService)
  investorProfile: InvestorProfile | null = null;
  private _screenService = inject(InvestorScreensService)
  private router = inject(Router)
  private userProfile!:Profile;

  constructor() { }

  investorProfileExists: boolean = false;


  ngOnInit() {
      this.investorProfileExists = !!sessionStorage.getItem('profileId');

      if(!this.investorProfileExists){
        this.router.navigate(['/investor/onboarding']);
      }
  }

  investorProfile$ = this._screenService.getInvestorProfileById().pipe(tap(investorProfile => {
    this.investorProfile = investorProfile ;
  }))

  signalsService =inject(SignalsService);
  showDialog(){
    this.signalsService.showDialog.set(true)
  }

  userProfile$ =this._profileService.get().pipe(tap(res =>{
    this.userProfile = res
    return res;

  }))

  getLocalized(number: number): string {
    return Number(number).toLocaleString();
  }


  get uniqueMobileNumber(): string {
    if (this.userProfile.mobileNumber) {
      // Split the string by commas, remove duplicates with Set, and join it back into a string
      const uniqueNumbers = Array.from(
        new Set(this.userProfile.mobileNumber.split(',').map(num => num.trim()))
      );
      return uniqueNumbers.join(', ');
    }
    // Return 'Add phone' if no number is available
    return 'Add phone';
  }


  getItems(items: unknown): string {
    if (Array.isArray(items)) {
      return items
        .filter(item => typeof item === 'object' && item !== null && 'name' in item) // Ensure each item has 'id'
        .map((item: any) => item.name.toString()) // Convert the id to string
        .join(', '); // Join with commas
    }
    return '';
  }
  

}
