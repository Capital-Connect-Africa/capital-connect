import { Component, inject, Input, OnInit } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
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
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { BusinessQuestionsService } from '../../services/business-questions.services';
import { Question } from '../../../questions/interfaces';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';



@Component({
  standalone: true,
  selector: 'app-business-questions',
  templateUrl: './businessQuestions.component.html',
  styleUrls: ['./businessQuestions.component.scss'],
  imports: [CommonModule, AccordionModule,ButtonModule,
    TabViewModule,  SharedModule, NavbarComponent,SkeletonModule, AngularMaterialModule, RouterModule, TableModule, AdvertisementSpaceComponent, ModalComponent]
})
export class BusinessQuestionsComponent implements OnInit {
  @Input() showBanner =false;

  investor_eligibility: { [key: string]: { [key: string]: number } } = {
    "IDEA": { "Step 1": 332, "Step 2": 333, "Step 3": 334 },
    "START-UP": { "Landing": 15, "Step 1": 3, "Step 2": 1, "Step 3": 9 },
    "PRE-REVENUE": { "Step 1": 232, "Step 2": 235, "Step 3": 335 },
    "POST-REVENUE": { "Step 1": 236, "Step 2": 237, "Step 3": 336 },
    "GROWTH STAGE": { "Step 1": 35, "Step 2": 37, "Step 3": 36 },
    "ESTABLISHED": { "Step 1": 67, "Step 2": 68, "Step 3": 69 },
    "LIQUIDATION": { "Step 1": 133, "Step 2": 136 }
  };


  // Convert object to array in a specific order
  investorEligibilityArray = [
    { key: "IDEA", stages: this.investor_eligibility["IDEA"] },
    { key: "START-UP", stages: this.investor_eligibility["START-UP"] },
    { key: "PRE-REVENUE", stages: this.investor_eligibility["PRE-REVENUE"] },
    { key: "POST-REVENUE", stages: this.investor_eligibility["POST-REVENUE"] },
    { key: "GROWTH STAGE", stages: this.investor_eligibility["GROWTH STAGE"] },
    { key: "ESTABLISHED", stages: this.investor_eligibility["ESTABLISHED"] },
    { key: "LIQUIDATION", stages: this.investor_eligibility["LIQUIDATION"] }
  ];



  


  investor_preparedness: { [key: string]: { [key: string]: number } } = {
    "PREPAREDNESS": { "Step 1": 16, "Step 2": 17, "Step 3": 18 },
  };

  loadedQuestions: { [key: string]: { [key: string]: Observable<any> } } = {};
  
  current_questions:Question[] = []
  isLoading: boolean = true;
 
  activeIndex: number | null = null;

  question$ = new Observable<Question[]>();


  //services
  private _bqs = inject(BusinessQuestionsService)

  ngOnInit(): void { }

  activeIndexChange(index : number){
    this.activeIndex = index
  }


  loadEligibiltyQuestionDetails(key: string) {
    this.current_questions = []
    const eligibility_steps = this.investor_eligibility[key];
  
    // Create an array of observables
    const questionsObservables = Object.values( eligibility_steps).map(stepId => {
      return this._bqs.getBusinessQuestions(stepId).pipe(
        tap(res => {
          this.current_questions.push(...res);
        })
      );
    });
  
    // Combine all observables into a single observable and flatten the results
    this.question$ = forkJoin(questionsObservables).pipe(
      map((responses: any[]) => {
        return responses.flat(); // Adjust as needed based on the response structure
      })
    );
  }




  loadPreparednessQuestionDetails(key: string) {
    this.current_questions = []

    const preparedness_steps = this.investor_preparedness[key]
  
    // Create an array of observables
    const questionsObservables = Object.values(preparedness_steps).map(stepId => {
      return this._bqs.getBusinessQuestions(stepId).pipe(
        tap(res => {
          this.current_questions.push(...res);
        })
      );
    });
  
    // Combine all observables into a single observable and flatten the results
    this.question$ = forkJoin(questionsObservables).pipe(
      map((responses: any[]) => {
        return responses.flat(); // Adjust as needed based on the response structure
      })
    );
  }









  

  toggleAccordion(index: number): void {
    index = index+1
    if(index===0){
      this.activeIndex = this.activeIndex === index+1 ? null : index+1;
    }
    this.activeIndex = this.activeIndex === index ? null : index; 



    if (this.activeIndex === index) {
      this.activeIndex = null; 
    } else {
      this.activeIndex = index; 
    }
  }

}
