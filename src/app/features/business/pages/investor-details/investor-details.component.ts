import { Component, inject } from '@angular/core';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { BusinessOnboardingScoringService } from '../../../../shared/services/business.onboarding.scoring.service';
import { MatchedInvestor } from '../../../../shared/interfaces';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { ActivatedRoute, Router } from '@angular/router';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { CompanyInvestorRelationsShip } from '../../../../shared/interfaces/relationship.enum';
import { BusinessLinks } from '../../../../core/utils/business.links';
import { Criteria } from '../../interfaces/special-criteria.interface';
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';


@Component({
  selector: 'app-investor-details',
  standalone: true,
  imports: [SidenavComponent, NavbarComponent, CommonModule, NumberAbbriviationPipe],
  templateUrl: './investor-details.component.html',
  styleUrl: './investor-details.component.scss'
})
export class InvestorDetailsComponent {
  links =BusinessLinks;
  private _router =inject(Router);
  private _activatedRoute =inject(ActivatedRoute);
  private _signalService =inject(SignalsService);
  specialCriteria:any[] =[]
  relationship_types =CompanyInvestorRelationsShip;
  relationship =CompanyInvestorRelationsShip.MATCHED;
  private _scoringService = inject(BusinessOnboardingScoringService);
  investor!: MatchedInvestor;
  canViewDeclineReasons =false;
  canViewInvestorDetails =false;
  declineReasons:string[] =[];
  response$ =new Observable<any>();
  specialCriteriaListing$ = new Observable<Criteria[]>()

  criteriaList:Criteria[] =[];
  private _specialCriteriaService =inject(SpecialCriteriaService);



  stats$ = this._activatedRoute.paramMap.pipe(
    switchMap(params => {
      const parts = `${params.get('id')}`.split('-');
      if(parts.length !==2) this._router.navigateByUrl('/business');
      this.relationship =parts[0] as CompanyInvestorRelationsShip;
      const id =Number(parts[1]);
      if(this.relationship ===CompanyInvestorRelationsShip.CONNECTED){
        return this._scoringService.getInvestorProfile(id).pipe(
          tap(res => {
            this.investor = res
            this.specialCriteria =this.investor.specialCriteria || [];
            this.checkIfUserCanViewPage();
              this.specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteriaByInvestor(res.id).pipe(tap(res =>{
                console.log("Calling special criteria list", res)
                this.criteriaList =res;
              }))
          })
        );
      }
      else if(this.relationship ==CompanyInvestorRelationsShip.REQUESTED){
        return this._scoringService.getConnectionRequests().pipe(
          tap(res => {
            this.investor = res.find((investor:MatchedInvestor) =>investor.id ===id) as MatchedInvestor
            this.checkIfUserCanViewPage();
            this.specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteriaByInvestor(this.investor.id).pipe(tap(res =>{
              console.log("Calling special criteria list", res)
              this.criteriaList =res;
            }))
          })
        );
      }
      else if(this.relationship ==CompanyInvestorRelationsShip.MATCHED){
        return this._scoringService.getInvestorProfile(id).pipe(
          tap(res => {
            this.investor = res;
            this.specialCriteria =this.investor.specialCriteria || [];
            this.checkIfUserCanViewPage();
            this.specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteriaByInvestor(res.id).pipe(tap(res =>{
              this.criteriaList =res;
            }))
          })
        );
      }
      else if(this.relationship ==CompanyInvestorRelationsShip.DECLINED){
        return this._scoringService.getDecliningInvestors().pipe(
          tap(res => {
            const investor =res.find((investor:MatchedInvestor) =>investor.id ===id)
            this.declineReasons =investor.declineReasons;
            this.checkIfUserCanViewPage();
          })
        );
      }
      this.checkIfUserCanViewPage();
      return EMPTY
    })
  );
  
  checkIfUserCanViewPage(){
    this.canViewDeclineReasons =!!this.declineReasons.length && (this.relationship ===CompanyInvestorRelationsShip.DECLINED)
    this.canViewInvestorDetails =!!this.investor && (this.relationship ===CompanyInvestorRelationsShip.CONNECTED || this.relationship ===CompanyInvestorRelationsShip.MATCHED || this.relationship ===CompanyInvestorRelationsShip.REQUESTED)
  }
  goBack(){
    if(this.relationship ===CompanyInvestorRelationsShip.MATCHED) this._signalService.matchedInvestorsDialogIsVisible.set(true);
    else if(this.relationship ===CompanyInvestorRelationsShip.CONNECTED) this._signalService.connectedInvestorsDialogIsVisible.set(true);
    else if(this.relationship ===CompanyInvestorRelationsShip.DECLINED) this._signalService.declinedConnectionsDialogIsVisible.set(true);
    else if(this.relationship ===CompanyInvestorRelationsShip.REQUESTED) this._signalService.connectionRequestsDialogIsVisible.set(true);
    this._router.navigateByUrl('/business')
  }

  takeSpecialCriteria(investorId:number){
    this._router.navigateByUrl(`/business/my-business/special-criteria/${this.relationship}-${investorId}`)
  }


  approveConnectionRequest(uuid: string){
    this.response$ =this._scoringService.respondToInvestorConnectionRequest(uuid, 'approve').pipe(tap(res =>{
    return this.goBack();
    }))
  }

  declineConnectionRequest(uuid: string){
    this.response$ =this._scoringService.respondToInvestorConnectionRequest(uuid, 'decline').pipe(tap(res =>{
      return this.goBack();
    }))
  }




  // specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteria().pipe(tap(res =>{
  //   this.criteriaList =res;
  // }))
  
  openQuestions(criteriId: number){
    this._router.navigateByUrl(`/business/special-criteria/${criteriId}`);
  }



}
