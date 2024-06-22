import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStateService } from '../../services/form-state/form-state.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { SubSection, SubSectionInput } from '../../interfaces';
import { Router } from '@angular/router';
import { QUESTION_FORM_STEPS } from "../../../../shared/interfaces/question.form.steps.enum";
import { UiComponent } from "../../components/ui/ui.component";

@Component({
  selector: 'app-subsection',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    SharedModule,
    UiComponent
  ],
  templateUrl: './subsection.component.html',
  styleUrl: './subsection.component.scss'
})
export class SubSectionComponent {

  protected readonly STEPS = QUESTION_FORM_STEPS;

  private _fb = inject(FormBuilder)
  private _formStateService = inject(FormStateService)
  private _router = inject(Router)

  subsectionForm = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  subsectionForm$ = this.subsectionForm.valueChanges.pipe(tap(vals => {
    const sectionId = this._formStateService.currentDashBoardData.sectionId;
    const input: SubSectionInput = {
      sectionId: sectionId,
      name: vals.name as string,
      description: vals.description as string
    }
    this._formStateService.setSubsectionForm(input);
    this._formStateService.setSubSectionFormIsValid(this.subsectionForm.valid);
  }));

  isSubsectionFormValid$ = this._formStateService.subsectionFormIsValid$.pipe(tap(isValid => {
    this.isSubsectionFormValid = isValid;
  }))

  nextOperation$: Observable<SubSection> = new Observable()
  isSubsectionFormValid = false;


  nextStep() {
    this.nextOperation$ = this._formStateService.createSubsection().pipe(tap(res => {
      this._router.navigate(['/questions/questions'])
    }));
  }

  prevStep() {
    this._router.navigate(['/questions/section'])
  }
}
