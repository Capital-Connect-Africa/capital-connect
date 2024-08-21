import { RouterLink } from "@angular/router";
import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import { Question, QuestionType } from "../../../../questions/interfaces";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { BusinessPageService} from "../../../services/business-page/business.page.service";
import { QuestionsService } from "../../../../questions/services/questions/questions.service";
import { Submission, SubmissionService, SubMissionStateService } from "../../../../../shared";
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';
import { QuestionsAnswerService } from '../../../../../shared/business/services/question.answers.service';
import { INVESTOR_PREPAREDNESS_SUBSECTION_IDS } from "../../../../../shared/business/services/onboarding.questions.service";

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
  private _pageService = inject(BusinessPageService);
  formGroup: FormGroup = this._formBuilder.group({});
  private _questionService = inject(QuestionsService);
  private _submissionService = inject(SubmissionService);
  private _questionAnswersService =inject(QuestionsAnswerService);
  private _submissionStateService = inject(SubMissionStateService);
  private _submissionsStorageService =inject(UserSubmissionsService);
  

  submission$ =new Observable<unknown>();
  questions$ =  this._questionService.getQuestionsOfSubSection(INVESTOR_PREPAREDNESS_SUBSECTION_IDS.STEP_THREE).pipe(
    switchMap(questions =>{
      return this._questionAnswersService.investorPreparedness(questions)
    }),
    tap(res =>{
      this.questions = res;
      this._createFormControls();
    })
  )

  private _createFormControls() {
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const answer =(question.defaultValues??[]);
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control(answer.map(a =>a.answerId), Validators.required));
      } else if(question.type ===this.fieldType.SINGLE_CHOICE || question.type ===this.fieldType.TRUE_FALSE){
        const answer =(question.defaultValues??[]).at(0);
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control(answer? answer.answerId??'':'', Validators.required));
      } else {
        const answer =(question.defaultValues??[]).at(0);
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control(answer? answer.text??'':'', Validators.required));
      }
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
    this._submissionsStorageService.investorPreparednessSubmissions.push(submissionData);
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
