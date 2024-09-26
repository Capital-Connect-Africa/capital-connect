import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, EMPTY, tap } from 'rxjs';
import { OrganizationInfoContainerComponent } from "../organization-info-container/organization-info-container.component";
import { CompanyResponse } from '../../interfaces';
import { ConfirmationService, FeedbackService } from '../../../../core';
import { CompanyHttpService } from '../../services/company.service';

@Component({
  selector: 'app-organization-info',
  standalone: true,
  imports: [CommonModule, OrganizationInfoContainerComponent],
  templateUrl: './organization-info.component.html',
  styleUrl: './organization-info.component.scss'
})
export class OrganizationInfoComponent {

  private _activateRoute = inject(ActivatedRoute);
  private _companiesService = inject(CompanyHttpService);
  private _companyId = Number(this._activateRoute.snapshot.paramMap.get('id'));
  private _confirmationService = inject(ConfirmationService);
  private _feedbackService = inject(FeedbackService);
  private _router = inject(Router);
  isInvestor:boolean = false

  constructor(){
    let investor = sessionStorage.getItem('profileId')

    if(investor){
      this.isInvestor = true
    }

  }
  
  delete$ = new Observable<unknown>();

  @Input({ required: true })company!: CompanyResponse;

  deleteCompany() {
    this.delete$ =
      this._confirmationService.confirm(`Are you sure you want to delete the company ${this.company.name}?`)
      .pipe(switchMap(res => {
        if (res) {
          return this._companiesService.deleteCompany(this._companyId)
        }
        return EMPTY
      }), tap(() => {
        this._feedbackService.success('Company deleted successfully')
        this._router.navigateByUrl('/')
      }))
  }

  editCompany(){
    this._router.navigateByUrl(`/organization/setup/${this.company.id}`)
  }


}
