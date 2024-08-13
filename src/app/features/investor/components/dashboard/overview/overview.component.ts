import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap } from "rxjs";
import { OverviewSectionComponent } from "../../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../../shared/business/services/busines.and.investor.matching.service";
import { AuthStateService } from "../../../../auth/services/auth-state.service";
import { MatchedBusiness,InterestingBusinesses,ConnectedBusiness } from '../../../../../shared/interfaces';

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
  private _authService = inject(AuthStateService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  visible = false;
  currentModal = '';

  matchedBusinesses: MatchedBusiness[] = [];
  connectedBusinesses: ConnectedBusiness[] = [];
  interestingBusinesses: InterestingBusinesses[] = [];
  rejectedBusinesses: MatchedBusiness[] = [];

  markAsInteresting$ = new Observable<unknown>()
  connectWithCompany$ = new Observable<unknown>()
  

  matchedCompanies$ = this._businessMatchingService.getMatchedCompanies().pipe(tap(res => { this.matchedBusinesses = res   }));

  connectedCompanies$ = this._businessMatchingService.getConnectedCompanies().pipe(
    tap(res => {this.connectedBusinesses = res;})
  );

  interestingCompanies$ = this._businessMatchingService.getInterestingCompanies().pipe(
    tap(res => {this.interestingBusinesses = res;})
  );



  showDialog(current_modal: string) {
    this.visible = !this.visible
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

  cancelConnection(businessId: string): void {
    console.log('Cancel connection for business with ID:', businessId);
  }

  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { console.log('Company marked as interesting'); })
    );

  }

  connect(id: number) {
    this.connectWithCompany$ = this._businessMatchingService.connectWithCompany(id).pipe(
      tap(() => { console.log('Connected with company'); })
    );
  }
}
