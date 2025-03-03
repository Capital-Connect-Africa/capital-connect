import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from '../../components/layout/layout.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecialCriteria } from '../../../../shared/interfaces/Investor';
import { TableModule } from 'primeng/table';
import { Observable, tap, switchMap, EMPTY } from 'rxjs';
import { SliceTextPipe } from "../../../../core/pipes/slice-text.pipe";
import { SpecialCriteriasService } from '../../../investor/services/special-criteria.services';
import { ConfirmationService } from '../../../../core';
import { Router } from '@angular/router';

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

  private _router =inject(Router);
  private _confirmationService =inject(ConfirmationService);
  private _specialCriteriasService =inject(SpecialCriteriasService)

  cols = [
    { field: 'title', header: 'Title' },
    { field: 'visibility', header: 'Visibility' },
    { field: 'questions', header: 'Questions' },
    { field: 'responses', header: 'Responses' },
    { field: 'description', header: 'Description' },
    { field: 'action', header: 'Action' },
  ];

  stats:{ name: string, icon: string, count: number }[] = []

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
    const values = this.form.value as SpecialCriteria;
    if(this.selectedCriteria){
      this.editCriteria$ =this._specialCriteriasService.updateSpecialCriteria(this.selectedCriteria.id, values).pipe(tap(_ =>{
        this.fetchCriteria();
        this.reset();
      }))
      return;
    }
    this.saveCriteria$ =this._specialCriteriasService.createSpecialCriteria(values).pipe(tap(_ =>{
      this.fetchCriteria();
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

  removeCriteria(criteriaId:number) {
    const criteria =this.selectCriteria(criteriaId); 
    if(!criteria) return;
    this.removeCriteria$ =this._confirmationService.confirm(`Remove ${criteria.title}? This action cannot be undone`).pipe(switchMap(ok =>{
      if(!ok) return EMPTY;
      return this._specialCriteriasService.deleteSpecialCriteria(criteriaId).pipe(tap(_ =>{
          this.fetchCriteria();
          this.reset();
        }))
    }))
  }

  viewCriteria(criteriaId: number) {
    this.reset()
    this._router.navigateByUrl(`/partner/special-criteria/${criteriaId}`)
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

  fetchCriteria(){
    this.getCriteria$ =this._specialCriteriasService.getPartnerSpecialCriteria().pipe(tap(res =>{
      this.specialCriteria =res;
      this.stats =[
        { name: 'Total', icon: 'pi pi-objects-column', count: res.length },
        { name: 'Global', icon: 'pi pi-globe', count: res.filter(criterion =>criterion.globalVisible).length },
        { name: 'Questions', icon: 'pi pi-list-check', count: res.map(criterion =>criterion.questions).flat().length },
        { name: 'Private', icon: 'pi pi-unlock', count: res.filter(criterion =>!criterion.globalVisible).length },
      ];
    }))
  }
  
}
