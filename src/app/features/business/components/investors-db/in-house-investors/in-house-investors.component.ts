import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridOptions, iconSetMaterial, ModuleRegistry, themeMaterial, ValueFormatterParams } from 'ag-grid-community';
import { tap } from 'rxjs';
import { formatCurrency } from '../../../../../core/utils/format.currency';
import { MatchedInvestor } from '../../../../../shared/interfaces';
import { BusinessOnboardingScoringService } from '../../../../../shared/services/business.onboarding.scoring.service';

ModuleRegistry.registerModules([AllCommunityModule]);

interface InvestorSummary{
  id: number;
  type: string;
  country: string;
  name: string | null;
  email: string | null;
  minFunding: number;
  maxFunding: number;
  status: 'Connected' | 'Matched'
}

@Component({
  selector: 'app-in-house-investors',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './in-house-investors.component.html',
  styleUrl: './in-house-investors.component.scss'
})

export class InHouseInvestorsComponent {
  @Output() onDataChange =new EventEmitter<{matches: number, connects: number, total: number}>()

    investors: InvestorSummary[] = [];
    totalInvestors =0;
    private _scoringService = inject(BusinessOnboardingScoringService);
    totalInvestors$ =this._scoringService.getTotalInvesors().pipe(tap(r =>{
      this.totalInvestors =r.totalInvestors;
    }));

    investorBusinessRelations$ =this._scoringService.getBusinessInvestorRelations().pipe(tap(res =>{
      const matchedInvestors =res.matches as any;
      const connectedInvestors =res.connections as MatchedInvestor[];
      this.investors =[
        ...matchedInvestors.map((investor: MatchedInvestor) =>({
          id: investor.id,
          type: investor.investorType,
          name: '-',
          email: '-',
          country: investor.headOfficeLocation,
          minFunding: investor.minimumFunding,
          maxFunding: investor.maximumFunding,
          status: 'Matched'
        })),
        ...connectedInvestors.map((investor: MatchedInvestor) =>({
          id: investor.id,
          type: investor.investorType,
          name: investor.organizationName,
          email: investor.emailAddress,
          country: investor.headOfficeLocation,
          minFunding: investor.minimumFunding,
          maxFunding: investor.maximumFunding,
          status: 'Connected'
        }))
      ]
      this.onDataChange.emit({matches: matchedInvestors.length, connects: connectedInvestors.length, total: this.totalInvestors})
    }))

    gridApi!: GridApi<Partial<InvestorSummary>>;
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
        { field: 'name'},
        { field: 'email',},
        { field: 'type',},
        { field: 'country',},
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
        { 
                  field: 'status',
                  cellRenderer: (params: any) => {
                    const value =params.value
                    const div =document.createElement('div');
                    const color = `${value === 'Matched'? '!bg-orange-100 !text-orange-600': value === 'Connected'? '!bg-green-200 !text-green-700': '!bg-rose-200 !text-rose-700'}`
                    div.innerHTML =`<span class ="capitalize  !px-2 !py-[2px] rounded-full !text-xs  !h-max !w-max ${color}">${params.value}</span>`;
                    div.classList.add(
                      'flex',
                      'items-center',
                      'h-full'
                    );
                    return div;
                  },
                },
        {
          field: 'open',
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
          editable: false,
          sortable: false,
          filter: false,
        },
        
      ] as ColDef[],
      defaultColDef: {
        flex: 1,
        filter: false,
      } as ColDef,
    };
}
