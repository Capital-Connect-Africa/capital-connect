import { Component, Input, SimpleChanges } from '@angular/core';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
  colorSchemeDarkBlue,
  ColDef,
  GridOptions,
  iconSetMaterial,
  GridApi,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'data-file-preview',
  standalone: true,
  imports: [ModalComponent, AgGridAngular],
  templateUrl: './data-file-preview.component.html',
  styleUrl: './data-file-preview.component.scss',
})
export class DataFilePreviewComponent {
  @Input() file!: File;
  visible = false;
  records:PublicInvestor[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file']) {
      this.visible = true;
      this.file = changes['file'].currentValue;
    }
  }

  gridApi!: GridApi<PublicInvestor>;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withParams({
      iconSize: 18,
      rowHoverColor: 'transparent',
      
    });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    getRowId: (params) => params.data.id,
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    columnDefs: [
      { field: 'name' },
      { field: 'type' },
      { field: 'minFunding' },
      { field: 'maxFunding' },
      { field: 'countries' },
      { field: 'fundingVehicle' },
      { field: 'useOfFunds' },
      { field: 'esgFocusAreas' },
      { field: 'businessGrowthStages' },
      { field: 'investmentStructures' },
      { field: 'contactName' },
      { field: 'contactEmail' },
      { field: 'website' },
      { field: 'sectors' },
      { field: 'subSectors' },
      { field: 'investees' },
      { field: 'description' },

      {
        field: 'actions',
        cellRenderer: (params: any) => {
          const div = document.createElement('div');
          const deleteButton = document.createElement('button');
          div.classList.add('flex', 'items-center', 'gap-3');
          deleteButton.innerHTML = `
              <i class="pi pi-times text-xs font-light"></i>
              <span class="font-light">Remove</span>
            `;
          deleteButton.classList.add(
            'flex',
            'items-center',
            'gap-2',
            'text-rose-300',
            'hover:text-rose-500',
            'transition-all'
          );
          deleteButton.addEventListener('click', () =>
            params.context.componentParent.deleteRow(params)
          );
          div.appendChild(deleteButton);
          return div;
        },
        width: 100,
        editable: false,
        sortable: false,
        filter: false,
      },
    ] as ColDef[],
    defaultColDef: {
      filter: true,
      editable: true,
    } as ColDef,
  };
}
