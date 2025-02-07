import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [PartnerLayoutComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss',
})
export class SpecialCriteriaComponent {
  specialCriteria = [
    { name: 'Total', icon: 'pi pi-objects-column', count: 0 },
    { name: 'Global', icon: 'pi pi-globe', count: 0 },
    { name: 'Responses', icon: 'pi pi-list-check', count: 0 },
    { name: 'Private', icon: 'pi pi-unlock', count: 0 }
  ];

  private _formBuilder =inject(FormBuilder)
  form =this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    globalVisible: []
  })
}
