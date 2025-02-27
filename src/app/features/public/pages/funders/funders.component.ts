import { Component, inject } from '@angular/core';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
  ColDef,
  GridOptions,
  ValueFormatterParams,
  iconSetMaterial,
  GridApi,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { Observable, tap } from 'rxjs';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { SearchEngineService } from '../../services/search-engine.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-funders',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './funders.component.html',
  styleUrl: './funders.component.scss'
})
export class FundersComponent {
  private _activatedRoute =inject(ActivatedRoute);
  private _searchEngineService =inject(SearchEngineService);
  private _publicInvestorService = inject(PublicInvestorsRepositoryService);

  
  q =this._activatedRoute.snapshot.params['q']
  searchedResults$ =this._searchEngineService.results$.pipe(tap(res =>{
    if(res.investors){
      this.publicInvestors =res.investors
    }else{
      this.getPublicInvestors()
    }
  }))

  publicInvestors: PublicInvestor[] = [];
  publicInvestors$ =new Observable()

  getPublicInvestors(){
    this.publicInvestors$ =this._publicInvestorService.searchInvestors({query: this.q}).pipe(tap(res =>{
      this.publicInvestors =res.investors
      this.q =res.q
    }))
  }
    



  gridApi!: GridApi<Partial<PublicInvestor>>;
    selectedColumns: string[] = [];
    theme = themeMaterial
      .withPart(iconSetMaterial)
      .withParams({
        iconSize: 18,
        wrapperBorderRadius: '.5rem',
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
          field: 'maxFunding',
          valueFormatter: (params: ValueFormatterParams) => {
            return '$' + formatCurrency(params.value);
          },
        },
        { field: 'countries' },
        { field: 'fundingVehicle',},
        { field: 'useOfFunds' },
        { field: 'esgFocusAreas' },
        { field: 'businessGrowthStages' },
        { field: 'investmentStructures' },
        { field: 'contactName',  },
        { field: 'contactEmail' },
        { field: 'website', },
        { field: 'sectors' },
        { field: 'subSectors' },
        { field: 'investees' },
        { field: 'description' },
      ] as ColDef[],
      defaultColDef: {
        filter: true,
      } as ColDef,
    };
}
