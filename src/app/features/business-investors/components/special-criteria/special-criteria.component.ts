import { Component, inject } from '@angular/core';
import { SpecialCriteriaService } from '../../../business/services/special-criteria/special-criteria.service';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Criteria } from '../../../business/interfaces/special-criteria.interface';
import { AccordionModule } from 'primeng/accordion';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-special-criteria',
  standalone: true,
  imports: [CommonModule, AccordionModule],
  templateUrl: './special-criteria.component.html',
  styleUrl: './special-criteria.component.scss'
})
export class SpecialCriteriaComponent {
  criterias:Criteria[] =[]
  private _activateRoute = inject(ActivatedRoute);
  private _specialCriteriaService =inject(SpecialCriteriaService);
  investorId = Number(this._activateRoute.snapshot.paramMap.get('id'));

  specialCriteriaQuestions$ =this._specialCriteriaService.getInvestorSpecialCriteria(this.investorId).pipe(tap(criteria =>{
    this.criterias =criteria;
    return criteria
  }))
}
