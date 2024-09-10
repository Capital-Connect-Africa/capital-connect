import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY } from "rxjs";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../../shared/business/services/busines.and.investor.matching.service";
import { AngularMaterialModule } from '../../../../../shared';
import { Router } from '@angular/router';
import { ConnectionRequest, MatchedBusiness, MatchMakingStats } from '../../../../../shared/interfaces';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSectionComponent,
    CardComponent,
    ModalComponent,
    AngularMaterialModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _router = inject(Router)

  matchMakingStats: MatchMakingStats | undefined 
  matchedBusinesses: MatchedBusiness[] = [];
  connectionRequestsCount!: number


  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res  }));
  matchMakingStats$ = this._businessMatchingService.getMatchMakingStatistics().pipe(tap(res => {
    this.matchMakingStats = res as MatchMakingStats
  }))

  // connectionRequestsCount$  = this._businessMatchingService.getConnectionRequestByInvestor(this.currentPage+1, this.pageSize).pipe(tap(res => {
  //   this.connectionRequestsCount = res.length
  // }))



  showDialog(current_modal: string) {
    if(current_modal === 'matched_businesses' ){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'interesting_businesses'){
      this._router.navigate(['/investor/interesting-businesess']);
    }else if(current_modal === 'connected_businesses'){
      this._router.navigate(['/investor/connected-businesess']);
    }
    else if(current_modal === 'rejected_businesses'){
      this._router.navigate(['/investor/rejected-businesess']);
    }
    else if(current_modal === 'connection_requests'){
      this._router.navigate(['/investor/connection-requests']);
    }
  }
}
