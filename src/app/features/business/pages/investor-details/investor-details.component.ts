import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { MatchedInvestor } from '../../../../shared/interfaces';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";


@Component({
  selector: 'app-investor-details',
  standalone: true,
  imports: [SidenavComponent, NavbarComponent, CommonModule, NumberAbbriviationPipe],
  templateUrl: './investor-details.component.html',
  styleUrl: './investor-details.component.scss'
})
export class InvestorDetailsComponent {
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},

  ]

  private _scoringService = inject(BusinessOnboardingScoringService);
  matchedInvestor!: MatchedInvestor;
  stats$ = this._scoringService.getMatchedInvestors().pipe(tap(res => {
    this.matchedInvestor = res.find(investor =>{
      debugger
      return investor.headOfficeLocation =='Kenya'
    }) as MatchedInvestor;
  }))

}
