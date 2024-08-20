import { switchMap, tap } from "rxjs";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DropdownModule } from "primeng/dropdown";
import { Component, inject } from '@angular/core';
import { Submission } from "../../../../../shared";
import { MultiSelectModule } from "primeng/multiselect";
import { AuthModule } from "../../../../auth/modules/auth.module";
import { Question, QuestionType } from "../../../../questions/interfaces";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { BusinessPageService } from "../../../services/business-page/business.page.service";
import { QuestionsService } from "../../../../questions/services/questions/questions.service";
import { CompanyStateService } from '../../../../organization/services/company-state.service';
import { UserSubmissionsService } from '../../../../../core/services/storage/user-submissions.service';
import { getInvestorEligibilitySubsectionIds } from "../../../../../shared/business/services/onboarding.questions.service";
import { QuestionsAnswerService } from "../../../../../shared/business/services/question.answers.service";

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [
    AuthModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
    MultiSelectModule
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent {
  private _formBuilder = inject(FormBuilder);
  private _pageService = inject(BusinessPageService);
  private _questionService = inject(QuestionsService);
  private _companyStateService = inject(CompanyStateService);
  private _questionAnswersService =inject(QuestionsAnswerService);
  private _userSubmissionsStorageService =inject(UserSubmissionsService);
  private _companyGrowthStage = this._companyStateService.currentCompany.growthStage;
  private _investorEligibilitySubsectionId = getInvestorEligibilitySubsectionIds(this._companyGrowthStage);

  private _idToLoad = (this._investorEligibilitySubsectionId).STEP_TWO
  formGroup: FormGroup = this._formBuilder.group({})
  protected fieldType = QuestionType;
  questions: Question[] = [];

  questions$ = this._questionService.getQuestionsOfSubSection(this._idToLoad).pipe(
    switchMap(questions =>{
      return this._questionAnswersService.investorEligibilityQuestionsAnswers(questions)
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
    this._pageService.setCurrentStep(3)
  }
  goBack() {
    this._pageService.setCurrentStep(1);
  }

  handleSubmit() {
    const formValues = this.formGroup.value;
    const submissionData: Submission[] = [];
    this.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const selectedAnswers = formValues['question_' + question.id];
        selectedAnswers.forEach((answerId: number) => {
          submissionData.push({
            id: question.submissionId,
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
          id: question.submissionId,
          text: formValues['question_' + question.id]
        });
      }
      else {
        submissionData.push({
          questionId: question.id,
          answerId: Number(formValues['question_' + question.id]),
          id: question.submissionId,
          text: question.type !== this.fieldType.SINGLE_CHOICE && question.type !== this.fieldType.TRUE_FALSE ? formValues['question_' + question.id] : ''
        });
      }
    });
    if(this._userSubmissionsStorageService.investorEligibilitySubmissions.length){
      this._userSubmissionsStorageService.investorEligibilitySubmissions[2] =submissionData;
    } else this._userSubmissionsStorageService.investorEligibilitySubmissions.push(submissionData);
    if(this._userSubmissionsStorageService.investorEligibilityDraft.length){
      this._userSubmissionsStorageService.investorEligibilityDraft[2] =submissionData;
    } else this._userSubmissionsStorageService.investorEligibilityDraft.push(submissionData);
    this.setNextStep();
  }
}
