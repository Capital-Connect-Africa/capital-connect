import { switchMap, tap } from 'rxjs';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
import { Submission } from "../../../../../shared";
import { MultiSelectModule } from "primeng/multiselect";
import { Component, inject, Input } from '@angular/core';
import { Question, QuestionType } from '../../../../questions/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import { QuestionsService } from '../../../../questions/services/questions/questions.service';
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';
import { QuestionsAnswerService } from '../../../../../shared/business/services/question.answers.service';
import { BUSINESS_INFORMATION_SUBSECTION_IDS } from "../../../../../shared/business/services/onboarding.questions.service";

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DropdownModule, MultiSelectModule],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})

export class StepOneComponent {
  questions: Question[] = [];
  private _formBuilder = inject(FormBuilder)
  private _pageService = inject(BusinessPageService);
  private _questionService = inject(QuestionsService);
  private _questionAnswersService =inject(QuestionsAnswerService);
  private _userSubmissionsStorageService =inject(UserSubmissionsService);

  formGroup: FormGroup = this._formBuilder.group({});
  
  questions$ = this._questionService.getQuestionsOfSubSection(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_ONE).pipe(
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
    this._pageService.setCurrentStep(2)
  }
  goBack() {
    this._pageService.setCurrentPage(1);
  }

  handleSubmit() {
    const formValues = this.formGroup.value;
    const submissionData: Submission[] = [];
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const selectedAnswers = formValues['question_' + question.id];
        const prevSubmissions =question.defaultValues;
        selectedAnswers.forEach((answerId: number) => {
          const sub =prevSubmissions?.find(s =>s.answerId ===answerId);
          submissionData.push({
            questionId: question.id,
            answerId: answerId,
            id: sub?.submissionId,
            text: ''
          });
        });
      } else if (question.type == this.fieldType.SHORT_ANSWER) {
        const openQuestion = question.answers.find(a => a.text === 'OPEN');
        const answerId = openQuestion ? openQuestion.id : formValues['question_' + question.id]

        submissionData.push({
          questionId: question.id,
          id: question.submissionId,
          answerId: parseInt(answerId),
          text: formValues['question_' + question.id]
        });
      }
      else {
        submissionData.push({
          questionId: question.id,
          id: question.submissionId,
          answerId: Number(formValues['question_' + question.id]),
          text: question.type !== this.fieldType.SINGLE_CHOICE && question.type !== this.fieldType.TRUE_FALSE ? formValues['question_' + question.id] : ''
        });
      }
    });
    this._userSubmissionsStorageService.saveBusinessInformationSubmissionProgress(submissionData, 1);
    this.setNextStep();
  }

  protected readonly fieldType = QuestionType;
}
