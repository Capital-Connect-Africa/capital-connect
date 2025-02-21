import { Component, inject } from '@angular/core';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { formatDistanceToNow } from 'date-fns';

import { 
  AllCommunityModule, ModuleRegistry, themeMaterial, colorSchemeDarkBlue,
  ColDef, GridOptions, ValueFormatterParams, iconSetMaterial, GridApi,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { ConfirmationService } from '../../../../core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-public-investors-repository',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, AgGridAngular],
  templateUrl: './public-investors-repository.component.html',
  styleUrl: './public-investors-repository.component.scss'
})
export class PublicInvestorsRepositoryComponent {
  private _confirmationService =inject(ConfirmationService);
  private gridApi!:GridApi<PublicInvestor>;
  selectedColumns:string[] =[];
  theme = themeMaterial.withPart(iconSetMaterial).withPart(colorSchemeDarkBlue).withParams({
    iconSize: 18,
    headerTextColor: 'dodgerblue',
    headerCellHoverBackgroundColor: 'rgba(80, 40, 140, 0.66)',
    headerCellMovingBackgroundColor: 'rgb(80, 40, 140)',
    selectedRowBackgroundColor: "rgba(0, 255, 0, 0.1)",
    rowHoverColor: 'rgba(0, 255, 0, 0.1)',
    wrapperBorderRadius: '.5rem',
  });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    rowSelection: { mode: "multiRow", enableSelectionWithoutKeys: true },
    onGridReady: params =>{
      this.gridApi =params.api
    },
    onCellValueChanged: cell =>{
      if(!cell.newValue) return;
      const payload:Partial<PublicInvestor> ={[cell.column.getColId()]: cell.newValue, id: Number(cell.data.id)};
      this.updateInvestorDetails(payload);
    },
    columnDefs: [
      { field: 'id', hide: true, sort: 'desc'},
      { field: "name", pinned: 'left'},
      { field: "type"},
      { field: "minFunding",
        valueFormatter: (params: ValueFormatterParams) => {
          return "$" + formatCurrency(params.value);
        },
       },
      { 
        field: "maxFunding",
        valueFormatter: (params: ValueFormatterParams) => {
          return "$" + formatCurrency(params.value);
        },
       },
       { field: "countries" },
       { field: "fundingVehicle" },
       { field: "useOfFunds",},
       { field: "esgFocusAreas",},
       { field: "businessGrowthStages",},
       { field: "investmentStructures",},
       { field: "contactName", },
      { field: "contactEmail", },
       { field: "website", },
      { field: "sectors",},
      { field: "subSectors",},
      { field: "investees",},
      { field: "createdAt",
        editable: false,
        valueFormatter: (params: ValueFormatterParams) => {
          return formatDistanceToNow(new Date(params.value),{addSuffix: true});
        },
         headerName: 'Created'
        },
      
        {
          field: 'actions',
          cellRenderer: (params: any) => {
              const button = document.createElement('button');
              button.innerHTML = `
                <i class="pi pi-times text-xs font-light"></i>
                <span class="font-light">Remove</span>
              `;
              button.classList.add('flex', 'items-center', 'gap-2', 'text-rose-300', 'transition-all');
              button.addEventListener('click', () => params.context.componentParent.deleteRow(params));
          
              return button;
            
          },
          pinned: 'right',
          width: 100,
          editable: false,
          sortable: false,
          filter: false
        }
    ] as ColDef[],
    defaultColDef: {
      filter: true,
      editable: true,
    } as ColDef
}

 ;
 
  delete$ =new Observable();
  updatePublicInvestor$ =new Observable();
  publicInvestors:PublicInvestor[] =[]

  private _publicInvestorService =inject(PublicInvestorsRepositoryService)

  publicInvestors$ =this._publicInvestorService.getInvestors().pipe(tap(res =>{
    this.publicInvestors =res
  }))

  updateInvestorDetails(payload: Partial<PublicInvestor>){
    this.updatePublicInvestor$ =this._publicInvestorService.updateInvestor(payload, Number(payload.id))
  }

  exportDataAsCSV(){
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.gridApi.exportDataAsCsv({
      columnKeys: this.selectedColumns.length ? this.selectedColumns : undefined,
      onlySelected: selectedData.length > 0,
      processCellCallback: (params) =>{
        if (params.column.getColId() === 'createdAt') {
          return params.node ? params.node.data['created'] : params.value;
        }
        return params.value;
      }
    })
  }
  
  deleteRow(node: any) {
    this.delete$ =this._confirmationService.confirm(`Do you want to remove ${node.data.name}? This action cannot be undone`).pipe(switchMap(status =>{
      if(status){
        this.publicInvestors = this.publicInvestors.filter(row => row.id !== node.data.id);
        this.gridApi.applyTransaction({ remove: [node.data] });
        return this._publicInvestorService.removeInvestor(node.data.id)
      }
      return EMPTY;
    }))
  }

}
