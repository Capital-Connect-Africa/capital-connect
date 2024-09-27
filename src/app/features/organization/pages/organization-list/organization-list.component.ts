import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { map } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { SharedModule } from '../../../../shared';
import { CompanyHttpService } from '../../services/company.service';
import { OrganizationCardComponent } from '../../components/organization-card/organization-card.component';
import { AdminUiContainerComponent } from "../../../admin/components/admin-ui-container/admin-ui-container.component";
import { Table, TableModule, TablePageEvent } from 'primeng/table';
import { CompanyResponse } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [UiSharedComponent, SharedModule, CommonModule, OrganizationCardComponent, InputGroupModule, InputGroupAddonModule, InputTextModule, ButtonModule, FormsModule, AdminUiContainerComponent, TableModule],
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent {
  isInvestor:boolean = false

  constructor(){
    let investor = sessionStorage.getItem('profileId')

    if(investor){
      this.isInvestor = true
    }
  }

  private _router = inject(Router);
  private _companiesService = inject(CompanyHttpService);
  companies: CompanyResponse[] = [];

  searchString = '';
  companies$ = this._companiesService.getAllCompanies().pipe(map(res => {
    this.companies = res;
    this.updateDisplayedData();
    this.companiesCount = res.length
  }))

  companiesCount = 0;
  companiesShowingCount = 0;

  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'country', header: 'Country' },
    { field: 'growthStage', header: 'Stage' },
    { field: 'businessSector', header: 'Sector' },
  ];

  @ViewChild('dt') table!: Table;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.table.filterGlobal(filterValue, 'contains');
    this.companiesCount = this.table.filteredValue ? this.table.filteredValue.length : this.companies.length;
    this.updateDisplayedData();
  }


  onPage(event: TablePageEvent) {
    this.updateDisplayedData()
  }

  updateDisplayedData() {
    const data = this.table.filteredValue || this.companies;
    const start = this.table.first ?? 10;
    const end = start + (this.table.rows ?? 10);
    this.companiesShowingCount = data.slice(start, end).length;
  }

  viewCompany(companyId: number) {
    let investor = sessionStorage.getItem('profileId')

    if (investor) {
      this._router.navigateByUrl(`/organization/investor/${companyId}`);
    }else{
      this._router.navigateByUrl(`/organization/${companyId}`);
    }

  }
}
