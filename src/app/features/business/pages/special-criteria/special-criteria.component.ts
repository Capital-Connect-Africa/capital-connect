import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionType } from '../../../questions/interfaces';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Criteria } from '../../interfaces/special-criteria.interface';
import { ConfirmationService } from '../../../../core';
import { Submission } from '../../../../shared/interfaces/submission.interface';
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { SubmissionService } from '../../../../shared';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [CommonModule, SidenavComponent, NavbarComponent, ReactiveFormsModule, MultiSelectModule, DropdownModule, DialogModule, ModalComponent],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss'
})
export class SpecialCriteriaComponent {
  links =[
    {label: 'Dashboard', href: '/business', exact: true, icon: 'grid_view'},
    {label: 'My Business', href: '/business/my-business', exact: false, icon: 'business_center'},
    {label: 'My Bookings', href: '/business/my-bookings', exact: false, icon: 'event'},
    {label: 'My Profile', href: '/user-profile', exact: true, icon: 'person'},
  ];
  step =0;
  visible =false;
  idParam:string ='';
  formSubmitted =false;
  fieldType =QuestionType;
  submission$ =new Observable();
  criteria:Criteria | null =null;
  private _router =inject(Router);
  private _fb =inject(FormBuilder);
  confirmation$ =new Observable<any>();
  specialCriteriaQuestions:Criteria[] =[];
  formGroup: FormGroup = this._fb.group({});
  private _activatedRoute =inject(ActivatedRoute);
  private _confirmationService =inject(ConfirmationService);
  private _specialCriteriaService =inject(SpecialCriteriaService);
  private _submissionsService =inject(SubmissionService);

  private _createFormControls() {
    this.formGroup =this._fb.group({});
    this.criteria?.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const answer =question.defaultValues??[];
        this.formGroup.addControl('question_' + question.id, this._fb.control(answer.map(a =>a.answerId), Validators.required));
      } else if(question.type ===this.fieldType.SINGLE_CHOICE || question.type ===this.fieldType.TRUE_FALSE){
        const answer =(question.defaultValues??[]).at(0);
        this.formGroup.addControl('question_' + question.id, this._fb.control(answer? answer.answerId??'':'', Validators.required));
      } else {
        const answer =(question.defaultValues??[]).at(0);
        this.formGroup.addControl('question_' + question.id, this._fb.control(answer? answer.text??'':'', Validators.required));
      }
    });
  }

  specialCriteriaQuestions$ =this._activatedRoute.paramMap.pipe(switchMap(param =>{
    this.idParam =param.get('id') || '';
    const parts =this.idParam.split('-');
    const investorId =Number(parts.at(-1))
    return this._specialCriteriaService.getCompanySpecialCriteria(investorId).pipe(tap((res: any[]) =>{
      // filter special criteria questions  based on investorId, and if it has questions
      this.specialCriteriaQuestions =res.filter(investor =>investor.investorProfile.id ==investorId && (investor.questions || []).length ).map(q =>({title: `${q.title}`, description: `${q.description}`, questions: (q.questions as Question[]).sort((a, b) =>a.order - b.order)}));
      this.getNextCriteria(0);
    }))
  }))
  
  getNextCriteria(stride: number =1){
    if(this.step +stride <0) return this.exitSpecialCriteria();
    if(this.step +stride >=this.specialCriteriaQuestions.length) {
      if(this.formSubmitted) this.visible =true;
      return
    }
    this.step +=stride;
    if(this.specialCriteriaQuestions.length >this.step) this.criteria =this.specialCriteriaQuestions[this.step];
    return this._createFormControls();
  }

  handleSubmit() {
    this.formSubmitted =false;
    const formValues = this.formGroup.value;
    const submissionData: Submission[] = [];
    this.criteria?.questions.forEach(question => {
      if (question.type === this.fieldType.MULTIPLE_CHOICE) {
        const selectedAnswers = formValues['question_' + question.id];
        selectedAnswers.forEach((answerId: number) => {
          submissionData.push({
            questionId: question.id,
            answerId: answerId,
            id: question.submissionId,
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

    this.submission$ =this._submissionsService.createMultipleSubmissions(submissionData.map(submission =>{
      delete submission.id;
      return submission;
    })).pipe(tap(_ =>{
      this.formGroup.reset();
      this.formSubmitted =true;
      return this.getNextCriteria(1);
    }))
  }

  exitSpecialCriteria(){
    return this.confirmation$ =this._confirmationService.confirm("Do you want to cancel this operation?").pipe(tap(confirmation =>{
      if(confirmation) this.goBack()
    }))
  }

  goBack(){
    this.visible =false;
    return this._router.navigateByUrl(`/business/my-business/investors/${this.idParam}`)
  }

  goToDashboard(){
    this.visible =false;
    return this._router.navigateByUrl(`/business`)
  }
}
