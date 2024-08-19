import { Component, inject } from '@angular/core';
import { BusinessPageService } from '../../../services/business-page/business.page.service';
import { QuestionsService } from "../../../../questions/services/questions/questions.service";
import { Submission, SubmissionService, SubMissionStateService } from "../../../../../shared";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { switchMap, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Question, QuestionType } from "../../../../questions/interfaces";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ProgressBarComponent } from "../../../../../core/components/progress-bar/progress-bar.component";
import { loadInvestorEligibilityQuestions } from "../../../../../shared/business/services/onboarding.questions.service";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { CompanyStateService } from '../../../../organization/services/company-state.service';
import { GrowthStage } from '../../../../organization/interfaces';
import { OrganizationOnboardService } from '../../../../organization/services/organization-onboard.service';
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProgressBarComponent, DropdownModule, MultiSelectModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})

export class IndexComponent {
  private _pageService = inject(BusinessPageService);
  private _questionService = inject(QuestionsService);
  private _submissionService = inject(SubmissionService);
  private _submissionStateService = inject(SubMissionStateService)
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _companyStateService = inject(CompanyStateService);
  private _orgOnboardService = inject(OrganizationOnboardService)
  private _submissionsStorageService =inject(UserSubmissionsService)

  fieldType = QuestionType

  formGroup: FormGroup = this._formBuilder.group({});
  questions$ = this._questionService.getQuestionsOfSubSection(loadInvestorEligibilityQuestions().LANDING).pipe(
    tap(questions => {
      this.questions = questions;
      this._createFormControls();
    })
  );
  currentEntries$ = this._submissionStateService.currentUserSubmission$;

  questions: Question[] = [];

  private _createFormControls() {
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control([], Validators.required));
      } else {
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control('', Validators.required));
      }
    });
  }

  onSubmit() {
    const formValues = this.formGroup.value;
    const submissionData: Submission[] = [];
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const selectedAnswers = formValues['question_' + question.id];
        selectedAnswers.forEach((answerId: number) => {
          submissionData.push({
            questionId: question.id,
            answerId: answerId,
            text: ''
          });
        });
      } else if (question.type == this.fieldType.SHORT_ANSWER) {
        const openQuestion = question.answers.find(a => a.text === 'OPEN');
        const answerId = openQuestion ? openQuestion.id : formValues['question_' + question.id]

        submissionData.push({
          questionId: question.id,
          answerId: parseInt(answerId),
          text: formValues['question_' + question.id]
        });
      }
      else {
        submissionData.push({
          questionId: question.id,
          answerId: Number(formValues['question_' + question.id]),
          text: question.type !== this.fieldType.SINGLE_CHOICE && question.type !== this.fieldType.TRUE_FALSE ? formValues['question_' + question.id] : ''
        });
      }
    });
    this._submissionsStorageService.investorEligibilitySubmissions.push(submissionData)
    this.setNextScreen()
    
   
  }

  skip() {
    this._router.navigateByUrl('/business')
  }

  setNextScreen() {
    this._pageService.setCurrentPage(2);
  }
}
