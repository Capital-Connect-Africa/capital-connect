import { Component, inject } from '@angular/core';
import { ReferralLinkComponent } from "../../../../shared/components/referral-link/referral-link.component";
import { ReferralsService } from '../../../admin/services/referrals.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../users/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReferralLinkComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  myReferres:User[] =[]
  private _authStateService =inject(AuthStateService);
  private _referralsService =inject(ReferralsService);

  myReferrees$ =this._referralsService.getMyReferees(this._authStateService.currentUserId()).pipe(tap(res =>{
    this.myReferres =res;
  }))

}
