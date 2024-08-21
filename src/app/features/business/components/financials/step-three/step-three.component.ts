import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { Observable, switchMap, tap } from "rxjs";
import { Component, inject } from '@angular/core';
import { MultiSelectModule } from "primeng/multiselect";
import { Question, QuestionType } from "../../../../questions/interfaces";
import { Submission, SubMissionStateService } from "../../../../../shared";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import { QuestionsService } from "../../../../questions/services/questions/questions.service";
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';
import { QuestionsAnswerService } from '../../../../../shared/business/services/question.answers.service';
import { BUSINESS_INFORMATION_SUBSECTION_IDS } from "../../../../../shared/business/services/onboarding.questions.service";

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DropdownModule, MultiSelectModule],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent {

  private _formBuilder = inject(FormBuilder)
  private _questionService = inject(QuestionsService);
  private _pageService = inject(BusinessPageService);
  private _submissionStateService = inject(SubMissionStateService);
  private _questionAnswersService =inject(QuestionsAnswerService);
  private _userSubmissionsStorageService =inject(UserSubmissionsService);

  questions: Question[] = [];
  fieldType = QuestionType;
  formGroup: FormGroup = this._formBuilder.group({})

  currentEntries$ = this._submissionStateService.currentUserSubmission$;
  submission$ = new Observable<unknown>()
  questions$ = this._questionService.getQuestionsOfSubSection(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_THREE).pipe(
    switchMap(questions =>{
      return this._questionAnswersService.businessInformation(questions)
    }),
    tap(res =>{
      this.questions = res;
      this._createFormControls();
    })
  )

  private _createFormControls() {
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const answer =question.defaultValues??[];
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

  setNextStep() {
    this._pageService.setCurrentStep(4);
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
      }
      else {
        submissionData.push({
          questionId: question.id,
          answerId: Number(formValues['question_' + question.id]),
          text: question.type !== this.fieldType.SINGLE_CHOICE && question.type !== this.fieldType.TRUE_FALSE ? formValues['question_' + question.id] : ''
        });
      }
    });

    this._userSubmissionsStorageService.saveBusinessInformationSubmissionProgress(submissionData, 3);   
    this.setNextStep();
  }


}
