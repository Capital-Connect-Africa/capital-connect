import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY } from "rxjs";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../../shared/business/services/busines.and.investor.matching.service";
import { AuthStateService } from "../../../../auth/services/auth-state.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness } from '../../../../../shared/interfaces';
import { FeedbackService , ConfirmationService} from '../../../../../core';
import {  switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSectionComponent,
    CardComponent,
    ModalComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _confirmationService = inject(ConfirmationService);
  visible = false;
  currentModal = '';

  matchedBusinesses: MatchedBusiness[] = [];
  connectedBusinesses: ConnectedBusiness[] = [];
  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: ConnectedBusiness[] = [];

  markAsInteresting$ = new Observable<unknown>()
  connectWithCompany$ = new Observable<unknown>()
  cancelConnectWithCompany$ = new Observable<unknown>()
  cancelInterestWithCompany$ = new Observable<unknown>()
  

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));

  connectedCompanies$ = this._businessMatchingService.getConnectedCompanies().pipe(
    tap(res => {this.connectedBusinesses = res;})
  );

  rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies().pipe(
    tap(res => {this.rejectedBusinesses = res;})
  );

  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
    tap(res => {this.interestingBusinesses = res;})
  );

  



  showDialog(current_modal: string) {
    this.visible = true
    this.currentModal = current_modal;
  }



  getModalTitle(): string {
    switch (this.currentModal) {
      case 'connected_businesses':
        return 'Connected Businesses';
      case 'matched_businesses':
        return 'Matched Businesses';
      case 'interesting_businesses':
        return 'Interesting Businesses';
      case 'rejected_businesses':
        return 'Rejected Businesess'
      default:
        return '';
    }
  }

  getModalHelperText(): string {
    switch (this.currentModal) {
      case 'connected_businesses':
        return 'You have connected with these businesses';
      case 'matched_businesses':
        return 'You had a good match with these businesses';
      case 'interesting_businesses':
        return 'These businesses have piqued your interest';
      case 'rejected_businesses':
        return 'You have rejected these businesses';
      default:
        return '';
    }
  }

  get modalData() {
    switch (this.currentModal) {
      case 'connected_businesses':
        return this.connectedBusinesses;
      case 'matched_businesses':
        return this.matchedBusinesses;
      case 'interesting_businesses':
        return this.interestingBusinesses;
      case 'rejected_businesses':
        return this.rejectedBusinesses;
      default:
        return [];
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  cancelConnection(businessId: number): void {
    this.cancelConnectWithCompany$ = this._businessMatchingService.cancelConnectWithCompany(businessId).pipe(
      tap(() => {
        this._feedBackService.success('Connection cancelled successfully.');

        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => {this.interestingBusinesses = res;})
        );
       })
    );
  }

  cancelInterest(businessId: number): void {
    this.cancelInterestWithCompany$ = this._businessMatchingService
    .cancelInterestWithCompany(businessId).pipe(
      tap(() => {
        this._feedBackService.success('Interest cancelled successfully.');
        this.rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies().pipe(
          tap(res => {this.rejectedBusinesses = res;})
        );
      })
    );
  }



  // cancelConnection(businessId: number): Observable<void> {
  //   return this._confirmationService.confirm('Are you sure you want to cancel this connection?').pipe(
  //     switchMap(confirmation => confirmation 
  //       ? this._businessMatchingService.cancelConnectWithCompany(businessId).pipe(
  //           tap(() => this._feedBackService.success('Connection cancelled successfully.'))
  //         )
  //       : EMPTY
  //     )
  //   );
  // }

  // cancelInterest(businessId: number): Observable<void> {
  //   return this._confirmationService.confirm('Are you sure you want to cancel this interest?').pipe(
  //     switchMap(confirmation => confirmation 
  //       ? this._businessMatchingService.cancelInterestWithCompany(businessId).pipe(
  //           tap(() => this._feedBackService.success('Interest cancelled successfully.'))
  //         )
  //       : EMPTY
  //     )
  //   );
  // }



  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.');
            
        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => {this.interestingBusinesses = res;})
        );
      
      })
        
    );

  }

  connect(id: number) {
    this.connectWithCompany$ = this._businessMatchingService.connectWithCompany(id).pipe(
      tap(() => { 
        this._feedBackService.success('Connected with company successfully.');
      
        this.connectedCompanies$ = this._businessMatchingService.getConnectedCompanies().pipe(
          tap(res => {this.connectedBusinesses = res;})
        );

        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => {this.interestingBusinesses = res;})
        );
      
      })
    );
  }
}
