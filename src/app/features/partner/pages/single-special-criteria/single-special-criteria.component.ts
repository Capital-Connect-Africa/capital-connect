import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { SpecialCriteriasService } from '../../../investor/services/special-criteria.services';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SpecialCriteria, SpecialCriteriaQuestion } from '../../../../shared/interfaces/Investor';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserSubmissionResponse } from '../../../../shared';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-single-special-criteria',
  standalone: true,
  imports: [PartnerLayoutComponent, CommonModule, ModalComponent, FormsModule, InputSwitchModule, MultiSelectModule, DropdownModule, ReactiveFormsModule],
  templateUrl: './single-special-criteria.component.html',
  styleUrl: './single-special-criteria.component.scss'
})

export class SingleSpecialCriteriaComponent {

  isFormValid:boolean =false;
  isCustomQuestion: boolean = true;
  specialCriteria!:SpecialCriteria;
  isQuestionsModalVisible:boolean =true;
  questions:UserSubmissionResponse[] =[];

  private _fb =inject(FormBuilder);
  private _activatedRoute =inject(ActivatedRoute);
  private _specialCriteriaService =inject(SpecialCriteriasService);


  criteriaId =Number(this._activatedRoute.snapshot.params['id'])

  specialCriteria$ =this._specialCriteriaService.getSpecialCriteriaById(this.criteriaId).pipe(tap(res =>{
    this.specialCriteria =res;
  }))

  questions$ =this._specialCriteriaService.getQuestions().pipe(tap(res =>{
    this.questions =res
  }))

  valueChanges$ =new Observable();

  ngOnInit(){
    this.valueChanges$ =this.criteriaQuestionForm.valueChanges.pipe(tap(_ =>{
      this.isFormValid =this.checkFormValidity();
    }))
  }
  
  addQuestion(){
    this.isQuestionsModalVisible =true;
  }

  toggleIsCustomQuestion(status: boolean =true){
    this.isCustomQuestion =status;
    this.isFormValid =this.checkFormValidity();
  }

  questionTypes =[
    {label: 'Multi-selections', value: 'MULTIPLE_CHOICE'},
    {label: 'Single-selection', value: 'SINGLE_CHOICE'},
    {label: 'Yes or No', value: 'TRUE_FALSE'},
    {label: 'Short answer', value: 'SHORT_ANSWER'},
  ]

  
  criteriaQuestionForm:FormGroup =this._fb.group({
    questionIds: [[]],
    text: [''],
    order: [''],
    type: [''],
    tooltip: ['']
  })

  submit(){
    const values =this.criteriaQuestionForm.value;
  }


  checkFormValidity(){
    if(!this.isCustomQuestion) return !!this.criteriaQuestionForm.get('questionIds')?.value.length
    return (!!this.criteriaQuestionForm.get('text')?.value &&
      !!this.criteriaQuestionForm.get('order')?.value &&
      !!this.criteriaQuestionForm.get('type')?.value &&
      !!this.criteriaQuestionForm.get('tooltip')?.value);
  }
  
}
