import { Component, inject, ViewChild } from '@angular/core';
import { DealsPipelinesStore } from '../../../../deals-pipeline/store/deals.pipelines.store';

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
import { formatCurrency } from '../../../../../core/utils/format.currency';
import { DealAsItem } from '../../../../deals-pipeline/interfaces/deal.interface';
import { DealStage } from '../../../../deals-pipeline/interfaces/deal.stage.interface';
import { DealStatus } from '../../../../deals-pipeline/enums/deal.status.enum';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from "../../../../../core/pipes/number-abbreviation.pipe";
import { AppexColumnChartComponent } from "../../../../../shared/components/charts/appex-column-chart/appex-column-chart.component";

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'deals-list-view',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NumberAbbriviationPipe, AppexColumnChartComponent],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})

export class ListViewComponent {
  
  store =inject(DealsPipelinesStore);

 private gridApi!: GridApi<DealAsItem>;
   selectedColumns: string[] = [];
   theme = themeMaterial
     .withPart(iconSetMaterial)
     .withParams({
       iconSize: 12,
       wrapperBorderRadius: '0',
       headerTextColor: 'white',
       headerBackgroundColor: '#064635',
       selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
       rowHoverColor: 'transparent',
     });
 
   gridOptions: GridOptions = {
     pagination: true,
     theme: this.theme,
     getRowId: (params) => `${params.data.id}`,
     onGridReady: (params) => {
       this.gridApi = params.api;
     },
     onCellValueChanged: (cell) => {
       if (!cell.newValue) return;
       const payload: Partial<DealAsItem> = {
         [cell.column.getColId()]: cell.newValue,
       };
 
      //  this.updateInvestorDetails(payload, Number(cell.data.id));
     },
     columnDefs: [
       { field: 'id', hide: true, sort: 'desc' },
       { field: 'name', headerName: 'Deal', pinned: 'left' },
       {
         field: 'value',
         headerName: 'Value',
         valueFormatter: (params: ValueFormatterParams) => {
           return '$' + formatCurrency(params.value);
          },
        },
        { field: 'stage.name', headerName: 'Stage', cellClass: '!text-xs flex items-center !font-normal font-sans' },
        { field: 'customer.name', headerName: 'Client', },
        { field: 'customer.email', headerName: 'Email',},
        { field: 'customer.phone', headerName: 'Phone',},
        
        { 
          field: 'status',
          cellRenderer: (params: any) => {
            const value =params.value as DealStatus
            const div =document.createElement('div');
            const color = `${value === DealStatus.ACTIVE? '!bg-[#2195f337] !text-[#2196f3]': ''}`
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
         field: 'actions',
         cellRenderer: (params: any) => {
           const div =document.createElement('div');
           const editButton = document.createElement('button');
           const deleteButton = document.createElement('button');
           div.classList.add(
             'flex',
             'items-center',
             'h-full'
           );
           deleteButton.innerHTML = `
             <i class="pi pi-trash text-xs"></i>
           `;
           deleteButton.classList.add(
             'flex',
             'items-center',
             'justify-center',
             '!h-[30px]',
             '!w-[30px]',
             'text-rose-300',
             'rounded-lg',
             'hover:text-rose-800',
             'hover:bg-rose-100',
             'transition-all'
           );
           editButton.innerHTML = `
             <i class="pi pi-pencil text-xs"></i>
           `;
           editButton.classList.add(
            'flex',
             'items-center',
             'justify-center',
             '!h-[30px]',
             '!w-[30px]',
             'text-green-800',
             'rounded-lg',
             'hover:text-green-800',
             'hover:bg-green-100',
             'transition-all'
           );
           editButton.addEventListener('click', () => 
             params.context.componentParent.selectInvestor(params)
           );
 
           deleteButton.addEventListener('click', () =>
             params.context.componentParent.deleteRow(params)
           );
 
           div.appendChild(editButton)
           div.appendChild(deleteButton)
           return div;
         },
         width: 150,
         editable: false,
         sortable: false,
         filter: false,
       },
     ] as ColDef[],
     defaultColDef: {
       filter: true,
       flex: 1,
     } as ColDef,
   };

 
    flattenStagesDeals(stages:DealStage[]): DealAsItem[]{
      return stages.map(
        stage =>stage.deals.map(
          deal =>({...deal, stage})
        )
      ).flat()

    }

    ngOnInit(){
      const data =this.store.stats().stageDealsCount.sort((a, b) =>a.value - b.value)
    
    }
}
