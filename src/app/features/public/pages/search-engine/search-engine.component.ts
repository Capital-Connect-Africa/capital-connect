import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Sector } from '../../../sectors/interfaces';
import { Observable, tap } from 'rxjs';
import { UserSearch } from '../../../../shared/interfaces/public.investor.interface';
import { SearchEngineService } from '../../services/search-engine.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './search-engine.component.html',
  styleUrl: './search-engine.component.scss'
})
export class SearchEngineComponent {
  currentStep =1;
  private _fb =inject(FormBuilder)
  private _router =inject(Router);
  private _searchEngineService =inject(SearchEngineService);

  sectors: string[] =[];
  subSectors:string[] =[];
  countries: string[] =[];
  useOfunds: string[] =[];
  allSectors: Sector[] =[]

  searchForm =this._fb.group({
    sector: ['', ],
    subSector: ['',],
    country: [''],
    targetAmount: [''],
    useOfFunds: ['']
  })

  steps =Object.keys(this.searchForm.controls).length

  save$ =new Observable();
  options$ =this._searchEngineService.fetchOptions().pipe(tap(res =>{
    this.allSectors =res.sectors
    this.useOfunds =res.useOfFunds
    this.countries =res.countries
    this.sectors =this.allSectors.map(res =>res.name)
  }))

  submit(){
    const formData =this.searchForm.value as Partial<UserSearch>;
    this.save$ =this._searchEngineService.searchInvestors(formData).pipe(tap(res =>{
      this._router.navigateByUrl(`/search-investors/${res.q}`);
    }))
  }

  handleSectorChange(event: any) {
    const values: string[] = event.value;
    this.subSectors =[];
    this.subSectors = [...new Set(this.allSectors
      .filter((sector) => values.includes(sector.name))
      .map((sector) => sector.subSectors?.map((subSector) => subSector.name)).flat())] as string[];
  }

  get isNextStepAllowed() {
    switch (this.currentStep) {
      case 1:
        return this.searchForm.get('sector')?.value;
      case 2:
        return this.searchForm.get('subSector')?.value;
      case 3:
        return this.searchForm.get('country')?.value;
      case 4:
        return this.searchForm.get('useOfFunds')?.value;
      case 5:
        return this.searchForm.get('targetAmount')?.value;
      default:
        return false;
    }
  }
  

  next(stride:number =1){
    if(stride <0 && this.currentStep <=1) return;
    if(stride >0 && this.currentStep >=this.steps) return;
    this.currentStep +=stride;
  }
  
}
