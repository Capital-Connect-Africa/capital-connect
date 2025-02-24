import { Component, inject, Input, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { ProfileService } from '../../../profile/services/profile.service';
import { RoutingService } from '../../../../shared/business/services/routing.service';
import { tap } from 'rxjs';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { Router, RouterModule } from '@angular/router';
import { InvestorProfile } from '../../../../shared/interfaces/Investor';
import { Profile } from '../../../../shared/interfaces/profile.interface';
import { Observable } from 'rxjs';
import { AdvisorProfile } from '../../../../shared/interfaces/advisor.profile';
import { AdvisorService } from '../../services/advisor-profile.service';
import { AdvisorUiContainerComponent } from "../admin-ui-container/advisor-ui-container.component";




@Component({
  standalone: true,
  selector: 'app-advisor-profile',
  templateUrl: './advisor-profile.component.html',
  styleUrls: ['./advisor-profile.component.scss'],
  imports: [NavbarComponent,
    MatIcon,
    NavbarComponent,
    CommonModule,
    AlertComponent,
    AdvisorUiContainerComponent,
    RouterModule]
})
export class AdvisorProfileComponent implements OnInit {
  @Input() showBanner =false;

  //services
  private _profileService =inject(ProfileService);
  private _advisorService = inject(AdvisorService) 
  private _router = inject(Router);

  //vars
  investorProfile: InvestorProfile | null = null;
  private userProfile!:Profile;
  userId: number = 0;

  //booleans
  investorProfileExists: boolean = false;
  
  //streams
  advisorProfile$ = new Observable<AdvisorProfile>()



  constructor() { }



  ngOnInit() {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        this.userId = parseInt(userId);

        this.advisorProfile$ = this._advisorService.getAdvisorProfileByUserId(this.userId).pipe(tap(res => {
          if(!res.id){
          this._router.navigate(['advisor/create-profile']);
          }
        }))
      }
  }



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
