import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Criteria } from '../../interfaces/special-criteria.interface';
import { NavbarComponent } from "../../../../core/components/navbar/navbar.component";
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";
import { SpecialCriteriaService } from '../../services/special-criteria/special-criteria.service';
import { Router } from '@angular/router';
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [CommonModule, SidenavComponent, NavbarComponent],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss'
})
export class SpecialCriteriaComponent {
  links =BusinessLinks;

  criteriaList:Criteria[] =[];
  private _router =inject(Router);
  private _specialCriteriaService =inject(SpecialCriteriaService);
  specialCriteriaListing$ =this._specialCriteriaService.listSPecialCriteria().pipe(tap(res =>{
    this.criteriaList =res;
  }))
  
  openQuestions(criteriId: number){
    this._router.navigateByUrl(`/business/special-criteria/${criteriId}`);
  }

}