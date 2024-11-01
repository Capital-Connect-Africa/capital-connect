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



@Component({
  standalone: true,
  selector: 'app-business-questions',
  templateUrl: './businessQuestions.component.html',
  styleUrls: ['./businessQuestions.component.scss'],
  imports: [CommonModule, AccordionModule,ButtonModule,   SharedModule, NavbarComponent, AngularMaterialModule, RouterModule, TableModule, AdvertisementSpaceComponent, ModalComponent]
})
export class BusinessQuestionsComponent implements OnInit {
  @Input() showBanner =false;

  data: { [key: string]: { [key: string]: number } } = {
    "Investor Preparedness": { "Step 1": 16, "Step 2": 17, "Step 3": 18 },
    "Investor Eligibility (Idea)": { "Step 1": 332, "Step 2": 333, "Step 3": 334 },
    "Investor Eligibility (Start-Up)": { "Landing": 15, "Step 1": 3, "Step 2": 1, "Step 3": 9 },
    "Pre-Revenue": { "Step 1": 232, "Step 2": 235, "Step 3": 335 },
    "Post-Revenue": { "Step 1": 236, "Step 2": 237, "Step 3": 336 },
    "Investor Eligibility (Growth Stage)": { "Step 1": 35, "Step 2": 37, "Step 3": 36 },
    "Investor Eligibility (Established)": { "Step 1": 67, "Step 2": 68, "Step 3": 69 },
    "Investor Eligibility (Liquidation)": { "Step 1": 133, "Step 2": 136 }
  };

  loadedQuestions: { [key: string]: { [key: string]: Observable<any> } } = {};
  
  current_questions:Question[] = []
 
  //vars

  // activeIndex: number = 0;

  activeIndex: number | null = null;

  question$ = new Observable<Question[]>();


  //services
  private _bqs = inject(BusinessQuestionsService)

  ngOnInit(): void { }

  activeIndexChange(index : number){
    this.activeIndex = index
  }


  loadQuestionDetails(key: string) {
    const steps = this.data[key];
  
    // Create an array of observables
    const questionsObservables = Object.values(steps).map(stepId => {
      return this._bqs.getBusinessQuestions(stepId).pipe(
        tap(res => {
          console.log("The response is", res)
          this.current_questions.push(...res);
        })
      );
    });
  
    // Combine all observables into a single observable and flatten the results
    this.question$ = forkJoin(questionsObservables).pipe(
      map((responses: any[]) => {
        // console.log("The flat respnse is",responses)
        // this.current_questions = responses
        // Flatten the array if necessary, assuming responses can be arrays
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
  }

}
