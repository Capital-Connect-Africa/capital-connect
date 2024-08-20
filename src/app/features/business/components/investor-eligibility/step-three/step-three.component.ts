import {Component, inject} from '@angular/core';
import {Question, QuestionType} from "../../../../questions/interfaces";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {QuestionsService} from "../../../../questions/services/questions/questions.service";
import {BusinessPageService} from "../../../services/business-page/business.page.service";
import {SubmissionService, SubMissionStateService, UserSubmissionResponse} from "../../../../../shared";
import {catchError, combineLatest, EMPTY, Observable, switchMap, tap} from "rxjs";
import {CommonModule} from "@angular/common";
import {AuthModule} from "../../../../auth/modules/auth.module";
import {RouterLink} from "@angular/router";
import {loadInvestorEligibilityQuestions} from "../../../../../shared/business/services/onboarding.questions.service";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';
import { SignalsService } from '../../../../../core/services/signals/signals.service';

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [CommonModule, AuthModule, ReactiveFormsModule, RouterLink, DropdownModule, MultiSelectModule],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent {
  questions: Question[] = [];
  private _formBuilder =inject(FormBuilder)
  private _questionService = inject(QuestionsService);
  private _pageService = inject(BusinessPageService);
  private _submissionService = inject(SubmissionService);
  private _signalsService =inject(SignalsService)
  formGroup: FormGroup =this._formBuilder.group({})
  fieldType =QuestionType;
  private _submissionStateService = inject(SubMissionStateService)
  private _userSubmissionsStorageService =inject(UserSubmissionsService);

  submission$ =new Observable<unknown>();
  questions$ =  this._questionService.getQuestionsOfSubSection(loadInvestorEligibilityQuestions().STEP_THREE).pipe(tap(questions => {
    this.questions = questions
    this._createFormControls();
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
    this._pageService.setCurrentPage(3)
  }
  goBack(){
    this._pageService.setCurrentStep(2);
  }

  handleSubmit(){
    const formValues =this.formGroup.value;
    const submissionData = this.questions.map(question => {
      const questionId =question.id;
      const openQuestion = question.answers.find(a => a.text === 'OPEN');
      const answerId =openQuestion ? openQuestion.id : formValues['question_' + question.id]
      return {questionId, answerId: parseInt(answerId), text: formValues['question_' + question.id]}
    });

    this._userSubmissionsStorageService.investorEligibilitySubmissions.push(submissionData);
    this.submission$ =this._submissionService.saveSectionSubmissions(this._userSubmissionsStorageService.investorEligibilitySubmissions).pipe(switchMap(res =>{
      return this._submissionStateService.getSectionSubmissions(true)
    }),
    tap(res =>{
      this.setNextStep()
    }),
    catchError(err =>{
      return EMPTY;
    }))
    }
}
