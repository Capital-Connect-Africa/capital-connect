import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { Observable, tap } from "rxjs";
import { QuestionsService } from "../../../../questions/services/questions/questions.service";
import { Question, QuestionType } from "../../../../questions/interfaces";
import { Submission, SubmissionService, SubMissionStateService } from "../../../../../shared";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import { BUSINESS_INFORMATION_SUBSECTION_IDS } from "../../../../../shared/business/services/onboarding.questions.service";


@Component({
  selector: 'app-step-four',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, MultiSelectModule],
  templateUrl: './step-four.component.html',
  styleUrl: './step-four.component.scss'
})
export class StepFourComponent {
  private _formBuilder = inject(FormBuilder)
  private _questionService = inject(QuestionsService);
  private _pageService = inject(BusinessPageService);
  private _submissionService = inject(SubmissionService);
  private _submissionStateService = inject(SubMissionStateService);

  questions: Question[] = [];
  fieldType = QuestionType;
  formGroup: FormGroup = this._formBuilder.group({})

  currentEntries$ = this._submissionStateService.currentUserSubmission$;
  submission$ = new Observable<unknown>()
  questions$ = this._questionService.getQuestionsOfSubSection(BUSINESS_INFORMATION_SUBSECTION_IDS.STEP_FOUR).pipe(tap(questions => {
    this.questions = questions
    this._createFormControls();
  }))

  private _createFormControls() {
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control([], Validators.required));
      } else {
        this.formGroup.addControl('question_' + question.id, this._formBuilder.control('', Validators.required));
      }
    });
  }
  
  setNextStep() {
    this._pageService.setCurrentPage(3);
  }
  goBack() {
    this._pageService.setCurrentStep(3);
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
    
    this.submission$ = this._submissionService.createMultipleSubmissions(submissionData).pipe(tap(() => {
      this.setNextStep();
    }));
  }

}
