import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Observable, tap,EMPTY } from "rxjs";
import { OverviewSectionComponent } from "../../../../shared/components/overview-section/overview-section.component";
import { CardComponent } from "../../../../shared/components/card/card.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { BusinessAndInvestorMatchingService } from "../../../../shared/business/services/busines.and.investor.matching.service";
import { MatchedBusiness,ConnectedBusiness } from '../../../../shared/interfaces';
import { FeedbackService } from '../../../../core';
import { AngularMaterialModule } from '../../../../shared';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { CompanyResponse} from '../../../organization/interfaces';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../../core';
import { AdvertisementSpaceComponent } from '../../../../shared/components/advertisement-space/advertisement-space.component';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationService } from 'ngx-pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-rejected-business',
  standalone: true,
  imports: [
    CommonModule,
    OverviewSectionComponent,
    CardComponent,
    ModalComponent,
    AngularMaterialModule,
    NavbarComponent,
    AdvertisementSpaceComponent,
    DialogModule,
    NgxPaginationModule
  ],
  templateUrl: './rejectedBusiness.component.html',
  styleUrl: './rejectedBusiness.component.scss',
  providers: [PaginationService]
})
export class RejectedBusinessComponent {
  private _feedBackService = inject(FeedbackService)
  private _businessMatchingService = inject(BusinessAndInvestorMatchingService)
  private _company = inject(CompanyHttpService)
  private _router = inject(Router)
  visible = false;
  currentModal = '';
  selectedBusiness: MatchedBusiness | null = null;
  selectedMatchedBusiness: MatchedBusiness | null = null;

  rejectedBusinesses: ConnectedBusiness[] = [];

  companyDetails: CompanyResponse | undefined;

  markAsInteresting$ = new Observable<unknown>()
  companyDetails$ = new Observable<unknown>()

  table:boolean = true

  itemsPerPage: number = 10;
  currentPage: number = 0; // Start at 0 for Material paginator
  pageSize: number = 10;
  totalItems: number = 0; // Set total items
  


  dataSource = new MatTableDataSource<ConnectedBusiness>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies(1,this.pageSize).pipe(
    tap(res => {
      this.rejectedBusinesses = res;
    })
  );


  matchMakingStats$ = this._businessMatchingService.getMatchMakingStatistics().pipe(tap(res => {
    this.totalItems = res?.declined
  }))


  pageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex; // Get the new page index
    this.pageSize = event.pageSize; // Get the new page size

     this.rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies(this.currentPage + 1, this.pageSize).pipe(
      tap(res => {
        this.rejectedBusinesses = res;
      })
    );
   
  }


  



  showDialog(current_modal: string) {
    if(current_modal === 'matched_businesses' ){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'interesting_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }else if(current_modal === 'connected_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }
    else if(current_modal === 'rejected_businesses'){
      this._router.navigate(['/investor/matched-business']);
    }

  }

  showDetails(business: MatchedBusiness): void {
    this.companyDetails$ = this._company.getSingleCompany(business.id).pipe(
      tap(res => {
        this.companyDetails = res     
      })
    )
    this.table = !this.table
    this.selectedBusiness = business;
  }


  hideDetails(): void {
    this.table = true
    this.selectedBusiness = null;
    this.selectedMatchedBusiness = null;
  }


  trackByIndex(index: number): number {
    return index;
  }


  showInterest(id: number) {
    this.markAsInteresting$ = this._businessMatchingService.markCompanyAsInteresting(id).pipe(
      tap(() => { 
        this._feedBackService.success('Company marked as interesting successfully.'); 
        this.rejectedCompanies$ = this._businessMatchingService.getRejectedCompanies(1,8).pipe(tap(res => {this.rejectedBusinesses = res;}));
      })        
    );
  }

}
