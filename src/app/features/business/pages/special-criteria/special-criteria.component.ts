import { Component, inject } from '@angular/core';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';
import { switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Question, QuestionType } from '../../../questions/interfaces';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [CommonModule, SidenavComponent, NavbarComponent, ReactiveFormsModule, MultiSelectModule, DropdownModule],
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

  fieldType =QuestionType
  questions:Question[] =[]
  private _fb =inject(FormBuilder);
  formGroup: FormGroup = this._fb.group({});
  private _activatedRoute =inject(ActivatedRoute);
  criteria:{title: string, description: string} | null =null;
  private _specialCriteriaService =inject(SpecialCriteriaService);

  private _createFormControls() {
    this.questions.forEach(question => {
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
    const investorId =Number(param.get('id'));
    return this._specialCriteriaService.getCompanySpecialCriteria().pipe(tap((res: any[]) =>{
      const criteria =res.find(investor =>investor.investorProfile.id ==investorId);
      this.questions =(criteria.questions as Question[]).sort((a, b) =>a.order - b.order);
      this.criteria ={title: criteria.title, description: criteria.description};
      this._createFormControls();
    }))
  }))
  
  handleSubmit(){

  }
}
