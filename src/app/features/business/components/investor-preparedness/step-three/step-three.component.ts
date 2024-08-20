import {Component, inject} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {PaginatorModule} from "primeng/paginator";
import {RouterLink} from "@angular/router";
import {Question, QuestionType} from "../../../../questions/interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {QuestionsService} from "../../../../questions/services/questions/questions.service";
import {BusinessPageService} from "../../../services/business-page/business.page.service";
import {Submission, SubmissionService, SubMissionStateService, UserSubmissionResponse} from "../../../../../shared";
import {catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import {
  INVESTOR_PREPAREDNESS_SUBSECTION_IDS
} from "../../../../../shared/business/services/onboarding.questions.service";
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [
    DropdownModule,
    MultiSelectModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent {
  questions: Question[] = [];
  fieldType = QuestionType;
  private _formBuilder = inject(FormBuilder)
  private _questionService = inject(QuestionsService);
  private _pageService = inject(BusinessPageService);
  private _submissionService = inject(SubmissionService);
  formGroup: FormGroup = this._formBuilder.group({});
  private _submissionStateService = inject(SubMissionStateService);
  private _submissionsStorageService =inject(UserSubmissionsService);
  

  submission$ = new Observable<unknown>()
  questions$ = this._questionService.getQuestionsOfSubSection(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.STEP_THREE).pipe(tap(questions => {
    this.questions = questions
    this._createFormControls();
  }))

  private _hasMatchingQuestionId(questions: Question[], responses: UserSubmissionResponse[]): boolean {
    const responseQuestionIds = new Set(responses.map(response => response.question.id));
    return questions.some(question => responseQuestionIds.has(question.id));
  }

  private _createFormControls() {
    this.questions.forEach(question => {
      this.formGroup.addControl('question_' + question.id, this._formBuilder.control('', Validators.required));
    });
  }

  setNextScreen() {
    this._pageService.setCurrentPage(3)
  }

  goBack() {
    this._pageService.setCurrentStep(2);
  }

  handleSubmit() {
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
      } else {
        submissionData.push({
          questionId: question.id,
          answerId: Number(formValues['question_' + question.id]),
          text: question.type !== this.fieldType.SINGLE_CHOICE && question.type !== this.fieldType.TRUE_FALSE ? formValues['question_' + question.id] : ''
        });
      }
    });
    this._submissionsStorageService.investorPreparednessSubmissions.push(submissionData)
    this.submission$ =this._submissionService.saveSectionSubmissions(this._submissionsStorageService.investorPreparednessSubmissions).pipe(switchMap(res =>{
      return this._submissionStateService.getSectionSubmissions(true)
    }),
    tap(res =>{
      this.setNextScreen();
    }),
    catchError(err =>{
      return EMPTY;
    }))
    }
  
}
