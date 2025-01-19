import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared';
import { CommonModule } from '@angular/common';
import { AdvisorUiContainerComponent } from "../admin-ui-container/advisor-ui-container.component";
import { TableModule } from 'primeng/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { CompanyHttpService } from '../../../organization/services/company.service';
import { Observable, tap } from 'rxjs';
import { CompanyResponse } from '../../../organization/interfaces';


@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [SharedModule,EditorModule, CommonModule,FormsModule, AdvisorUiContainerComponent, TableModule, CommonModule, RouterModule, ModalComponent],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})

export class ClientDetails {
  //vars


  //services
  private _route = inject(ActivatedRoute)
  private _companyService = inject(CompanyHttpService)

  //observables
  company_details$ = new Observable<CompanyResponse>()
  



  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if(id){
    this.company_details$ = this._companyService.getCompanyOfUser(Number(id)).pipe(tap(res=>{
      console.log("The response is", res)
      
    }))


    }

  }

}
