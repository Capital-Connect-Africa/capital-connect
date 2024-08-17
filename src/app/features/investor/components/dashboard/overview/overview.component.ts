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
import { AngularMaterialModule } from '../../../../../shared';


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
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  visible = false;
  currentModal = '';
  selectedBusiness: InterestingBusinesses | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;


  matchedBusinesses: MatchedBusiness[] = [];
  connectedBusinesses: ConnectedBusiness[] = [];
  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: ConnectedBusiness[] = [];

  markAsInteresting$ = new Observable<unknown>()
  connectWithCompany$ = new Observable<unknown>()
  cancelConnectWithCompany$ = new Observable<unknown>()
  cancelInterestWithCompany$ = new Observable<unknown>()
  table:boolean = true
  

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
    this.table =true
    this.currentModal = current_modal;
    this.selectedBusiness = null;
    this.selectedMatchedBusiness = null;
  }

  showDetails(business: InterestingBusinesses): void {
    this.table = !this.table
    this.selectedBusiness = business;
  }

  showMatchedBusinessDetails(business: MatchedBusiness): void {
    this.table = !this.table
    this.selectedMatchedBusiness = business;
  }

  hideDetails(): void {
    this.table = true
    this.selectedBusiness = null;
    this.selectedMatchedBusiness = null;
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
        return 'Declined Businesess'
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
        return 'You have declined these businesses';
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


        this.interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
          tap(res => {this.interestingBusinesses = res;})
        );        
        this.rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies().pipe(
          tap(res => {this.rejectedBusinesses = res;})
        );
      })
    );
  }



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
