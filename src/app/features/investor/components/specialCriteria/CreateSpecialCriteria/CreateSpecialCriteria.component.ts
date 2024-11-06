import { Component, inject, Input, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../../core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpecialCriteriasService } from '../../../services/special-criteria.services';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-CreateSpecialCriteria',
  templateUrl: './CreateSpecialCriteria.component.html',
  styleUrls: ['./CreateSpecialCriteria.component.scss'],
  imports:[NavbarComponent, ReactiveFormsModule, CommonModule]
})
export class CreateSpecialCriteriaComponent implements OnInit {
  @Input() showBanner =false;

  //services
  private _formBuilder = inject(FormBuilder);
  private _specialCriteria = inject(SpecialCriteriasService)
  private _router = inject(Router)

  //vars
  specialCriteriaForm!: FormGroup;
  questionsForm!:FormGroup
  investorProfileId:number = 0

  //streams
  submit$ = new Observable<unknown>()

  constructor() { }

  ngOnInit() {
    this.investorProfileId = Number(sessionStorage.getItem('profileId'))

    this.specialCriteriaForm = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      globalVisible:[false,Validators.required]
    })
  }

  onSubmit():void{
    if(this.specialCriteriaForm.valid){
    const formData = this.specialCriteriaForm.value
    formData.investorProfileId  = this.investorProfileId
    this.submit$ = this._specialCriteria.createSpecialCriteria(formData).pipe(
      tap(res =>{
        this._router.navigate(['/investor/special-criteria']);
      })
    )

    }
  }


  

}
