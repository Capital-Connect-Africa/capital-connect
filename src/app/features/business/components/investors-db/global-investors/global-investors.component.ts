import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AllCommunityModule, ColDef, colorSchemeDarkBlue, GridApi, GridOptions, iconSetMaterial, ModuleRegistry, themeMaterial, ValueFormatterParams } from 'ag-grid-community';
import { formatCurrency } from '../../../../../core/utils/format.currency';
import { PublicInvestor, PublicInvestorDashboard } from '../../../../../shared/interfaces/public.investor.interface';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PublicInvestorsRepositoryService } from '../../../../../core/services/investors/public-investors-repository.service';
import { SearchEngineService } from '../../../../public/services/search-engine.service';
import { CommonModule } from '@angular/common';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-global-investors',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './global-investors.component.html',
  styleUrl: './global-investors.component.scss'
})
export class GlobalInvestorsComponent {
  
  private _activatedRoute =inject(ActivatedRoute);
  private _searchEngineService =inject(SearchEngineService);
  private _publicInvestorService = inject(PublicInvestorsRepositoryService);
  @Output() onDataChange =new EventEmitter<Partial<PublicInvestorDashboard>>()
  
    
q =this._activatedRoute.snapshot.params['q']
searchedResults$ = new Observable();
  publicInvestors: PublicInvestor[] = [];
  publicInvestorsDb:PublicInvestorDashboard ={
    total: 0,
    matches: 0,
    investors: [],
    matchesBySector: 0,
    availableFunding: 0,
    matchByUseOfFunds: 0,
    matchesByCountries: 0,
    matchesBySubSector: 0,
  };
  publicInvestors$ =this._publicInvestorService.filterInvestorsByProfile().pipe(tap(res =>{
    const investorsData =res as unknown as PublicInvestorDashboard;
    this.publicInvestorsDb ={...investorsData};
    delete (investorsData as any).investors;
    this.onDataChange.emit( investorsData  );
  }))
  gridApi!: GridApi<Partial<PublicInvestor>>;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withParams({
      iconSize: 16,
      wrapperBorderRadius: '.5rem',
      headerCellHoverBackgroundColor: 'transparent',
      headerCellMovingBackgroundColor: 'transparent',
      selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
      rowHoverColor: 'transparent',
    });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    columnDefs: [
      { field: 'id', hide: true, sort: 'desc' },
      { field: 'name',},
      { field: 'type',},
      {
        field: 'minFunding',
        valueFormatter: (params: ValueFormatterParams) => {
          return '$' + formatCurrency(params.value);
        },
      },
      {
        field: 'actions',
        cellRenderer: (params: any) => {
          const div =document.createElement('div');
          const viewButton = document.createElement('button');
          div.classList.add(
            'flex',
            'items-center',
            'gap-3',
          );
          viewButton.innerHTML = `
              <i class="pi pi-info-circle text-xs font-light"></i>
              <span class="font-light">Details</span>
          `;
          viewButton.classList.add(
            'flex',
            'items-center',
            'gap-2',
            'text-blue-500',
            'hover:text-blue-800',
            'transition-all'
          );
          viewButton.addEventListener('click', () => 
            params.context.componentParent.selectInvestor(params)
          );

          div.appendChild(viewButton)
          return div;
        },
        width: 100,
        editable: false,
        sortable: false,
        filter: false,
      },
      // {
      //   field: 'maxFunding',
      //   valueFormatter: (params: ValueFormatterParams) => {
      //     return '$' + formatCurrency(params.value);
      //   },
      // },
      // { field: 'countries' },
      // { field: 'fundingVehicle',},
      // { field: 'useOfFunds' },
      // { field: 'esgFocusAreas' },
      // { field: 'businessGrowthStages' },
      // { field: 'investmentStructures' },
      // { field: 'contactName',  },
      // { field: 'contactEmail' },
      // { field: 'website', },
      // { field: 'sectors' },
      // { field: 'subSectors' },
      // { field: 'investees' },
      // { field: 'description' },
    ] as ColDef[],
    defaultColDef: {
      filter: false,
      flex: 1,
    } as ColDef,
  };
}
