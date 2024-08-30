import { Component, inject, Input, OnInit } from '@angular/core';
import { FeedbackService, NavbarComponent } from '../../../../../core';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomQuestion, SpecialCriteria } from '../../../../../shared/interfaces/Investor';
import { SpecialCriteriasService } from '../../../services/special-criteria.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSubmissionResponse } from '../../../../../shared';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { DropdownModule } from 'primeng/dropdown';
import { QuestionsService } from '../../../../questions/services/questions/questions.service';

@Component({
  standalone: true,
  selector: 'app-view-special-criteria',
  templateUrl: './ViewSpecialCriteria.component.html',
  styleUrls: ['./ViewSpecialCriteria.component.scss'],
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule, MultiSelectModule, ModalComponent, DropdownModule]
})
export class ViewSpecialCriteriaComponent implements OnInit {
  @Input() showBanner = false;
  //services
  sc = inject(SpecialCriteriasService)
  private _feedBackService = inject(FeedbackService);
  private _formBuilder = inject(FormBuilder);
  private _answer = inject(QuestionsService)


  //boolean
  update: boolean = false;
  addQuestions: boolean = false;
  add_custom_ques: boolean = false
  add_custom_answers: boolean = false
  multiple_answers: boolean = false

  // Variables
  specialCriteriaId!: number;
  specialCriteria!: SpecialCriteria;
  specialCriteriaForm!: FormGroup;
  questionsForm!: FormGroup
  questionsRemoveForm!: FormGroup
  customQuestionsForm!: FormGroup
  customAnswersForm!: FormGroup

  customQuestionResponse!: CustomQuestion
  questions!: UserSubmissionResponse[];
  question_types: string[] = ["MULTIPLE_CHOICE", "SINGLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]
  //streams
  addQuestions$!: Observable<unknown>;
  removeQuestions$!: Observable<unknown>;
  specialCriteriaId$!: Observable<number | null>;
  getSpecialCriteria$!: Observable<SpecialCriteria>;
  update$!: Observable<unknown>;
  addCustomQuestions$!: Observable<unknown>
  createAnwer$!: Observable<unknown>

  questions$ = this.sc.getQuestions().pipe(tap(res => {
    this.questions = res
  }))

  constructor(private route: ActivatedRoute) {
    this.specialCriteriaId$ = this.route.params.pipe(
      map(params => Number(params['id'])),
      tap(id => {
        this.specialCriteriaId = id;
        this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
          this.specialCriteria = res
        }))
      })
    );
  }

  ngOnInit() {
    this.customAnswersForm = this._formBuilder.group({
      text: ['', Validators.required],
      weight: ['', Validators.required],
    })

    this.customQuestionsForm = this._formBuilder.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      tooltip: ['', Validators.required],
      order: ['', Validators.required]
    })

    this.questionsForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.questionsRemoveForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.specialCriteriaForm = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  patchForm(): void {
    this.questionsForm = this._formBuilder.group({
      questionIds: [[], Validators.required]
    })

    this.specialCriteriaForm.patchValue({
      title: this.specialCriteria.title,
      description: this.specialCriteria.description
    })
  }

  onUpdate() {
    this.update = true
    this.patchForm()
  }

  onAddQuestions() {
    this.addQuestions = true
    this.patchForm()
  }

  addCustomQues() {
    this.add_custom_ques = true
  }

  onCustomQuestionsSubmit() {
    if (this.customQuestionsForm) {
      const formData = this.customQuestionsForm.value

      this.addCustomQuestions$ = this.sc.addCustomQuestionsToSpecialCriteria(formData).pipe(tap(res => {
        this._feedBackService.success('Custom Question Added To Special Criteria Successfully')
        this.customQuestionResponse = res

        let body = {
          specialCriteriaId: this.specialCriteriaId,
          questionIds: [res.id]
        }

        this.addQuestions$ = this.sc.addQuestionsToSpecialCriteria(body).pipe(tap(res => {
        }))
        this.add_custom_answers = true
        this.customQuestionsForm.reset()


        if (this.customQuestionResponse.type == "MULTIPLE_CHOICE" || this.customQuestionResponse.type == "SINGLE_CHOICE") {
          this.multiple_answers = true
        } else if (formData.type == "SHORT_ANSWER") {
          this.customAnswersForm.patchValue({
            text: "OPEN",
          })
        }
      }))

    }
  }

  onCustomAnswersSubmit() {
    if (this.customAnswersForm) {
      const formData = this.customAnswersForm.value

      formData.questionId = this.customQuestionResponse.id
      this.createAnwer$ = this.sc.createAnswer(formData).pipe(tap(res => {
        this.customAnswersForm.reset();
        if (!this.multiple_answers) {
          this.add_custom_ques = false
          this.add_custom_answers = false
        }
      }));
    }
  }

  cancel() {
    this.add_custom_ques = false
  }

  onQuestionsSubmit() {
    if (this.questionsForm) {
      const formData = this.questionsForm.value

      let body = {
        specialCriteriaId: this.specialCriteriaId,
        questionIds: formData.questionIds
      }

      this.addQuestions$ = this.sc.addQuestionsToSpecialCriteria(body).pipe(tap(res => {
        this._feedBackService.success('Questions Added To Special Criteria Successfully')
        this.questionsForm.reset()
      }))

    }
  }

  onQuestionsRemove() {
    if (this.questionsRemoveForm) {
      const formData = this.questionsRemoveForm.value

      let body = {
        specialCriteriaId: this.specialCriteriaId,
        questionIds: formData.questionIds
      }

      this.removeQuestions$ = this.sc.removeQuestionsFromSpecialCriteria(body).pipe(tap(res => {
        this._feedBackService.success('Questions Removed From Special Criteria Successfully')
        this.questionsRemoveForm.reset()

      }))

    }
  }

  onSubmit() {
    if (this.specialCriteriaForm.valid) {
      const formData = this.specialCriteriaForm.value
      this.update$ = this.sc.updateSpecialCriteria(this.specialCriteria.id, formData).pipe(
        tap(res => {
          this._feedBackService.success('Special Criteria Updated Successfully')
          this.getSpecialCriteria$ = this.sc.getSpecialCriteriaById(this.specialCriteriaId).pipe(tap(res => {
            this.specialCriteria = res
          }))

          this.update = false
        })
      )
    }

  }
}