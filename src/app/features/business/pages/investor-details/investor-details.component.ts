import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { MatchedInvestor } from '../../../../shared/interfaces';
import { EMPTY, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { ActivatedRoute, Router } from '@angular/router';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { CompanyInvestorRelationsShip } from '../../../../shared/interfaces/relationship.enum';


@Component({
  selector: 'app-investor-details',
  standalone: true,
  imports: [SidenavComponent, NavbarComponent, CommonModule, NumberAbbriviationPipe],
  templateUrl: './investor-details.component.html',
  styleUrl: './investor-details.component.scss'
})
export class InvestorDetailsComponent {
  private _router =inject(Router);
  private _activatedRoute =inject(ActivatedRoute);
  private _signalService =inject(SignalsService);
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},

  ]
  relationship_types =CompanyInvestorRelationsShip;
  relationship =CompanyInvestorRelationsShip.MATCHED;
  private _scoringService = inject(BusinessOnboardingScoringService);
  investor!: MatchedInvestor;
  canViewPage =false
  stats$ = this._activatedRoute.paramMap.pipe(
    switchMap(params => {
      const parts = `${params.get('id')}`.split('-');
      if(parts.length !==2) this._router.navigateByUrl('/business');
      this.relationship =parts[0] as CompanyInvestorRelationsShip;
      const id =parts[1];
      if(this.relationship ===CompanyInvestorRelationsShip.CONNECTED){
        return this._scoringService.getConnectedInvestors().pipe(
          tap(res => {
            this.investor = res.find(investor => `${investor.id}` === id) as MatchedInvestor;
            this.checkIfUserCanViewPage();
          })
        );
      }
      else if(this.relationship ==CompanyInvestorRelationsShip.MATCHED){
        return this._scoringService.getMatchedInvestors().pipe(
          tap(res => {
            this.investor = res.find(investor => `${investor.id}` === id) as MatchedInvestor;
            this.checkIfUserCanViewPage();
          })
        );
      }
      this.checkIfUserCanViewPage();
      return EMPTY
    })
  );
  
  checkIfUserCanViewPage(){
    this.canViewPage =!!this.investor && (this.relationship ===CompanyInvestorRelationsShip.CONNECTED || this.relationship ===CompanyInvestorRelationsShip.MATCHED)
  }
  goBack(){
    if(this.relationship ===CompanyInvestorRelationsShip.MATCHED) this._signalService.matchedInvestorsDialogIsVisible.set(true);
    else if(this.relationship ===CompanyInvestorRelationsShip.CONNECTED) this._signalService.connectedInvestorsDialogIsVisible.set(true);
    this._router.navigateByUrl('/business')
  }
}
