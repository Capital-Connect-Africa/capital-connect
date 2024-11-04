import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SpecialCriteria, SpecialCriteriaQuestions } from '../../../../shared/interfaces/Investor';
import { SpecialCriteriasService } from '../../services/special-criteria.services';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { AngularMaterialModule } from '../../../../shared/angular-material.module';
import { RouterModule } from '@angular/router';
import { ConfirmationService, FeedbackService } from '../../../../core';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { AdvertisementSpaceComponent } from "../../../../shared/components/advertisement-space/advertisement-space.component";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";



@Component({
  standalone: true,
  selector: 'app-special-criteria',
  templateUrl: './specialCriteria.component.html',
  styleUrls: ['./specialCriteria.component.scss'],
  imports: [CommonModule, SharedModule, NavbarComponent, AngularMaterialModule, RouterModule, TableModule, AdvertisementSpaceComponent, ModalComponent]
})
export class SpecialCriteriaComponent implements OnInit {
  @Input() showBanner =false;

  //vars
  specialCriteria: SpecialCriteria[] = []
  investorProfileId: number = 0;


  specialCriteria$ = new Observable<SpecialCriteria[]>;
  selectedCriteria$ = new  Observable<SpecialCriteria>;
  deleteConf$ = new Observable<boolean>();
  delete$ = new Observable<unknown>
  loading = false;
  error: string | null = null;

  //services
  private _specialCriteria = inject(SpecialCriteriasService)
  private _confirmationService = inject(ConfirmationService);
  private _feedBackService = inject(FeedbackService);


  ngOnInit(): void {
    this.investorProfileId = Number(sessionStorage.getItem('profileId'))

    this.loadSpecialCriteria();
  }

  loadSpecialCriteria(): void {
    this.loading = true;
    this.specialCriteria$ = this._specialCriteria.getAllSpecialCriteriaByInvestorProfile(this.investorProfileId).pipe(
      tap(res =>{
        this.specialCriteria = res
      })
    );
  }

  deleteCriteria(id:number){

    this.deleteConf$ = this._confirmationService.confirm('Are you sure you want to delete this special criteria?').pipe(tap(conf =>{
      if(conf){
        this.delete$ = this._specialCriteria.deleteSpecialCriteria(id).pipe(tap(res=>{
        this._feedBackService.success('Special Criteria Deleted Successfully')

          this.loadSpecialCriteria()
        }))        
      }
    }))
  }


 
  loadSpecialCriteriaById(id: number): void {
    this.loading = true;
    this.selectedCriteria$ = this._specialCriteria.getSpecialCriteriaById(id).pipe(
      tap({
        next: () => (this.loading = false),
        error: (err) => {
          this.error = 'Failed to load special criteria details';
          console.error(err);
          this.loading = false;
        }
      })
    );
  }

  createSpecialCriteria(criteria: SpecialCriteria): void {
    this.loading = true;
    this._specialCriteria.createSpecialCriteria(criteria).pipe(
      tap({
        next: () => this.loadSpecialCriteria(),
        error: (err) => {
          this.error = 'Failed to create special criteria';
          console.error(err);
          this.loading = false;
        }
      })
    );
  }

  updateSpecialCriteria(id: number, criteria: SpecialCriteria): void {
    this.loading = true;
    this._specialCriteria.updateSpecialCriteria(id, criteria).pipe(
      tap({
        next: () => this.loadSpecialCriteria(),
        error: (err) => {
          this.error = 'Failed to update special criteria';
          console.error(err);
          this.loading = false;
        }
      })
    );
  }


  addQuestionsToCriteria(criteriaQuestions: SpecialCriteriaQuestions): void {
    this.loading = true;
    this._specialCriteria.addQuestionsToSpecialCriteria(criteriaQuestions).pipe(
      tap({
        next: () => this.loadSpecialCriteria(),
        error: (err) => {
          this.error = 'Failed to add questions to special criteria';
          console.error(err);
          this.loading = false;
        }
      })
    );
  }

  removeQuestionsFromCriteria(criteriaQuestions: SpecialCriteriaQuestions): void {
    this.loading = true;
    this._specialCriteria.removeQuestionsFromSpecialCriteria(criteriaQuestions).pipe(
      tap({
        next: () => this.loadSpecialCriteria(),
        error: (err) => {
          this.error = 'Failed to remove questions from special criteria';
          console.error(err);
          this.loading = false;
        }
      })
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

}
