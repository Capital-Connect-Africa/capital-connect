import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { SpecialCriteriasService } from '../../../investor/services/special-criteria.services';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { CustomQuestion, SpecialCriteria, SpecialCriteriaQuestion } from '../../../../shared/interfaces/Investor';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
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
  specialCriteria!:SpecialCriteria;
  isCustomQuestion: boolean = false;
  isQuestionsModalVisible:boolean =true;
  questions:SpecialCriteriaQuestion[] =[];

  private _fb =inject(FormBuilder);
  private _activatedRoute =inject(ActivatedRoute);
  private _specialCriteriaService =inject(SpecialCriteriasService);


  submit$ =new Observable();
  questions$ =new Observable();
  specialCriteria$ =new Observable();
  criteriaId =Number(this._activatedRoute.snapshot.params['id'])

  getQuestions(){
    this.questions$ =this._specialCriteriaService.getQuestions().pipe(tap((res:any) =>{
      this.questions =res
    }))
    return EMPTY;
  }

  getSpecialCriteria(){
    this.specialCriteria$ =this._specialCriteriaService.getSpecialCriteriaById(this.criteriaId).pipe(tap(res =>{
      this.specialCriteria =res;
    }));
    return EMPTY;
  }
  valueChanges$ =new Observable();

  ngOnInit(){
    this.getQuestions();
    this.getSpecialCriteria();
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
    const questionIds:number[] =values.questionIds
    const requests =[]
    if(questionIds.length) requests.push(this._specialCriteriaService.addQuestionsToSpecialCriteria({questionIds, specialCriteriaId: this.criteriaId}))
    if(this.isCustomQuestion && this.isFormValid){
      delete values.questionIds
      requests.push(this._specialCriteriaService.addCustomQuestionsToSpecialCriteria(values as CustomQuestion))
    }
    this.submit$ =combineLatest(requests).pipe(switchMap(() =>{
      if(this.isCustomQuestion){
        this.isCustomQuestion =false;
        this.criteriaQuestionForm.reset();
        this.criteriaQuestionForm.patchValue({questionIds: questionIds})
        return this.getQuestions() as any;
      }
      return this.getSpecialCriteria().pipe(tap(() =>{
        debugger
        this.reset()
      }))
    }))
  }


  checkFormValidity(){
    if(!this.isCustomQuestion) return !!this.criteriaQuestionForm.get('questionIds')?.value.length
    return (!!this.criteriaQuestionForm.get('text')?.value &&
      !!this.criteriaQuestionForm.get('order')?.value &&
      !!this.criteriaQuestionForm.get('type')?.value &&
      !!this.criteriaQuestionForm.get('tooltip')?.value);
  }

  reset(){
    this.isCustomQuestion =false;
    this.criteriaQuestionForm.reset();
    this.isQuestionsModalVisible =false;
    this.isFormValid =this.checkFormValidity();
  }
  
}
