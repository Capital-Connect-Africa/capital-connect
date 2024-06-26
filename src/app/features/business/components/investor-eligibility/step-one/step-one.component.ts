import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthModule} from "../../../../auth/modules/auth.module";
import {Question, QuestionType} from "../../../../questions/interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {QuestionsService} from "../../../../questions/services/questions/questions.service";
import {BusinessPageService} from "../../../services/business-page/business.page.service";
import {SubmissionService, SubMissionStateService, UserSubmissionResponse} from "../../../../../shared";
import {combineLatest, Observable, tap} from "rxjs";

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    AuthModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent {
  questions: Question[] = [];
  private _formBuilder =inject(FormBuilder)
  private _questionService = inject(QuestionsService);
  private _pageService = inject(BusinessPageService);
  private _submissionService = inject(SubmissionService);
  formGroup: FormGroup =this._formBuilder.group({})
  field_type =QuestionType;
  private _submissionStateService = inject(SubMissionStateService)
  // subsections$ = this._questionService.getSubSectionsOfaSection(5).pipe(tap(res => {
  //   debugger
  // }))

  submission$ =new Observable<unknown>();
  questions$ =  this._questionService.getQuestionsOfSubSection(3).pipe(tap(questions => {
    this.questions = questions
    this._createFormControls();
  }))

  currentEntries$ = this._submissionStateService.currentUserSubmission$;
  init$ = combineLatest([this.questions$, this.currentEntries$]).pipe(tap(res => {
    if(this._hasMatchingQuestionId(res[0], res[1])) { //Checks whether
      this.setNextStep();
    }
  }))

  private _hasMatchingQuestionId(questions: Question[], responses: UserSubmissionResponse[]): boolean {
    // Create a set of question ids from the responses array
    const responseQuestionIds = new Set(responses.map(response => response.question.id));

    // Check if any question in the questions array has an id in the responseQuestionIds set
    return questions.some(question => responseQuestionIds.has(question.id));
  }

  private _createFormControls() {
    this.questions.forEach(question => {
      this.formGroup.addControl('question_' + question.id, this._formBuilder.control('', Validators.required));
    });
  }
  setNextStep(){
    this._pageService.setCurrentStep(2)
  }
  goBack(){
    this._pageService.setCurrentPage(1);
  }

  handleSubmit(){

    const formValues =this.formGroup.value;
    const submissionData = this.questions.map(question => {
      const questionId =question.id;
      const openQuestion = question.answers.find(a => a.text === 'OPEN');
      const answerId =openQuestion ? openQuestion.id : formValues['question_' + question.id]
      return {questionId, answerId: parseInt(answerId), text: formValues['question_' + question.id]}
    });

    this.submission$ = this._submissionService.createMultipleSubmissions(submissionData).pipe(tap(res => {
      this.setNextStep();
    }))
  }
}
