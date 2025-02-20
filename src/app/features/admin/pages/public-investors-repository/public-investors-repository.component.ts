import { Component, inject } from '@angular/core';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { formatDistanceToNow } from 'date-fns';

import { 
  AllCommunityModule, ModuleRegistry, themeMaterial, colorSchemeDarkBlue,
  ColDef, GridOptions, ValueFormatterParams, iconSetMaterial,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-public-investors-repository',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, AgGridAngular],
  templateUrl: './public-investors-repository.component.html',
  styleUrl: './public-investors-repository.component.scss'
})
export class PublicInvestorsRepositoryComponent {
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
    rowSelection: { mode: "multiRow" },
    onCellValueChanged: cell =>{
      if(!cell.newValue) return;
      const payload:Partial<PublicInvestor> ={[cell.column.getColId()]: cell.newValue, id: Number(cell.data.id)};
      this.updateInvestorDetails(payload);
    },
    columnDefs: [
      { field: "name"},
      { field: "type", },
      { field: "minFunding",
        valueFormatter: (params: ValueFormatterParams) => {
          return "$" + params.value.toLocaleString();
        },
       },
      { 
        field: "maxFunding",
        valueFormatter: (params: ValueFormatterParams) => {
          return "$" + params.value.toLocaleString();
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
      

    ] as ColDef[],
    defaultColDef: {
      filter: true,
      editable: true,
    } as ColDef
}

 ;
 
  updatePublicInvestor$ =new Observable();
  publicInvestors:PublicInvestor[] =[]

  private _publicInvestorService =inject(PublicInvestorsRepositoryService)

  publicInvestors$ =this._publicInvestorService.getInvestors().pipe(tap(res =>{
    this.publicInvestors =res
  }))

  updateInvestorDetails(payload: Partial<PublicInvestor>){
    this.updatePublicInvestor$ =this._publicInvestorService.updateInvestor(payload, Number(payload.id))
  }

}
