import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecialCriteria } from '../../../../shared/interfaces/Investor';
import { TableModule } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { SliceTextPipe } from "../../../../core/pipes/slice-text.pipe";
import { SpecialCriteriaService } from '../../services/special.criteria.service';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [
    PartnerLayoutComponent,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    SliceTextPipe
],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss',
})
export class SpecialCriteriaComponent {
  saveCriteria$ = new Observable();
  removeCriteria$ =new Observable();
  editCriteria$ =new Observable();
  getCriterion$ =new Observable();
  getCriteria$ =new Observable();
  action_title ='Create a special criteria'
  selectedCriteria: SpecialCriteria | null = null;
  specialCriteria:SpecialCriteria[] =[]

  private _specialCriteriaService =inject(SpecialCriteriaService)

  cols = [
    { field: 'title', header: 'Title' },
    { field: 'visibility', header: 'Visibility' },
    { field: 'questions', header: 'Questions' },
    { field: 'respondents', header: 'Respondents' },
    { field: 'description', header: 'Description' },
    { field: 'action', header: 'Action' },
  ];

  stats = [
    { name: 'Total', icon: 'pi pi-objects-column', count: 0 },
    { name: 'Global', icon: 'pi pi-globe', count: 0 },
    { name: 'Responses', icon: 'pi pi-list-check', count: 0 },
    { name: 'Private', icon: 'pi pi-unlock', count: 0 },
  ];

  private _formBuilder = inject(FormBuilder);
  form = this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    globalVisible: [false],
  });

  ngOnInit(){
    this.fetchCriteria();
  }

  handleSubmit() {
    const values = this.form.value as Partial<SpecialCriteria>;
    if(this.selectedCriteria){
      this.editCriteria$ =this._specialCriteriaService.edit(this.selectedCriteria.id, values).pipe(tap(res =>{
        this.selectedCriteria =res;
        this.reset();
      }))
      return;
    }
    this.saveCriteria$ =this._specialCriteriaService.save(values).pipe(tap(res =>{
      this.selectedCriteria =res;
      this.reset();
    }))
  }

  editCriteria(criteriaId: number) {
    const selectedCriteria = this.selectCriteria(criteriaId);
    if (selectedCriteria) {
      this.form.patchValue({
        title: selectedCriteria.title,
        description: selectedCriteria.description,
        globalVisible: selectedCriteria.globalVisible,
      });
      this.action_title =`Update ${selectedCriteria.title}`
    }
  }

  removeCriteria(criteriaId: number) {
    this.removeCriteria$ =this._specialCriteriaService.remove(criteriaId).pipe(tap(_ =>{
      this.reset();
    }))
  }

  viewCriteria(criteriaId: number) {
    this.reset()
    const selectedCriteria = this.selectCriteria(criteriaId);
  }

  selectCriteria(criteriaId: number) {
    this.selectedCriteria = this.specialCriteria.find(
      (criteria) => criteria.id === criteriaId
    ) as SpecialCriteria;
    return this.selectedCriteria;
  }

  reset() {
    this.form.reset();
    this.selectedCriteria = null;
    this.action_title ='Create a special criteria';
  }

  fetchCriteria(page:number =1, limit:number =10){
    this.getCriteria$ =this._specialCriteriaService.findAll(page, limit).pipe(tap(res =>{
      this.specialCriteria =res;
    }))
  }
  
}
