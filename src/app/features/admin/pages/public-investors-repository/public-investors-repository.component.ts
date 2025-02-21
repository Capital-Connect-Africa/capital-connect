import { Component, inject } from '@angular/core';
import { PublicInvestorsRepositoryService } from '../../../../core/services/investors/public-investors-repository.service';
import { PublicInvestor } from '../../../../shared/interfaces/public.investor.interface';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from '../../components/admin-ui-container/admin-ui-container.component';
import { formatDistanceToNow } from 'date-fns';

import {
  AllCommunityModule,
  ModuleRegistry,
  themeMaterial,
  colorSchemeDarkBlue,
  ColDef,
  GridOptions,
  ValueFormatterParams,
  iconSetMaterial,
  GridApi,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { ConfirmationService } from '../../../../core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InvestorScreensService } from '../../../investor/services/investor.screens.service';
import { CountriesService } from '../../../../shared/services/countries.service';
import { SectorsService } from '../../../sectors/services/sectors/sectors.service';
import { Sector } from '../../../sectors/interfaces';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-public-investors-repository',
  standalone: true,
  imports: [
    CommonModule,
    AdminUiContainerComponent,
    AgGridAngular,
    ModalComponent,
    MultiSelectModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  templateUrl: './public-investors-repository.component.html',
  styleUrl: './public-investors-repository.component.scss',
})
export class PublicInvestorsRepositoryComponent {
  visible = false;
  private _formBuilder = inject(FormBuilder);
  private _sectorsService = inject(SectorsService);
  private _countriesService = inject(CountriesService);
  private _investorsService = inject(InvestorScreensService);
  private _confirmationService = inject(ConfirmationService);

  useOfFunds: string[] = [];
  fundingVehicle: string[] = [];
  esgFocusAreas: string[] = [];
  businessGrowthStages: string[] = [];
  investmentStructures: string[] = [];
  investorTypes: string[] = [];
  countries: string[] = [];
  sectors: string[] = [];
  allSectors: Sector[] = [];
  subSectors: string[] = [];

  useOfFunds$ = this._investorsService.getUseOfFunds().pipe(
    tap((res) => {
      this.useOfFunds = res.map((r) => r.title);
    })
  );

  esgFocusAreas$ = this._investorsService.getEsgFocusAreas().pipe(
    tap((res) => {
      this.esgFocusAreas = res.map((r) => r.title);
    })
  );

  businessGrowthStages$ = this._investorsService.getStages().pipe(
    tap((res) => {
      this.businessGrowthStages = res.map((r) => r.title);
    })
  );

  investmentStructures$ = this._investorsService.getInvestmentStructures().pipe(
    tap((res) => {
      this.investmentStructures = res.map((r) => r.title);
    })
  );

  investorTypes$ = this._investorsService.getInvestorTypes().pipe(
    tap((res) => {
      this.investorTypes = res.map((r) => r.title ?? '');
    })
  );

  countries$ = this._countriesService.getCountries().pipe(
    tap((res) => {
      this.countries = res.map((r) => r.name);
    })
  );

  sectors$ = this._sectorsService.getAllSectors().pipe(
    tap((res) => {
      this.sectors = res.map((r) => r.name);
      this.allSectors = res;
    })
  );

  handleSectorChange(event: any) {
    const values: string[] = event.value;
    this.subSectors =[];
    this.subSectors = [...new Set(this.allSectors
      .filter((sector) => values.includes(sector.name))
      .map((sector) => sector.subSectors?.map((subSector) => subSector.name)).flat())] as string[];
  }

  private gridApi!: GridApi<PublicInvestor>;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withPart(colorSchemeDarkBlue)
    .withParams({
      iconSize: 18,
      headerTextColor: 'dodgerblue',
      headerCellHoverBackgroundColor: 'rgba(80, 40, 140, 0.66)',
      headerCellMovingBackgroundColor: 'rgb(80, 40, 140)',
      selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
      rowHoverColor: 'rgba(0, 255, 0, 0.1)',
      wrapperBorderRadius: '.5rem',
    });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    rowSelection: { mode: 'multiRow', enableSelectionWithoutKeys: true },
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    onCellValueChanged: (cell) => {
      if (!cell.newValue) return;
      const payload: Partial<PublicInvestor> = {
        [cell.column.getColId()]: cell.newValue,
        id: Number(cell.data.id),
      };
      this.updateInvestorDetails(payload);
    },
    columnDefs: [
      { field: 'id', hide: true, sort: 'desc' },
      { field: 'name', pinned: 'left' },
      { field: 'type' },
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
      {
        field: 'createdAt',
        editable: false,
        pinned: 'right',
        valueFormatter: (params: ValueFormatterParams) => {
          return formatDistanceToNow(new Date(params.value), {
            addSuffix: true,
          });
        },
        headerName: 'Created',
      },

      {
        field: 'actions',
        cellRenderer: (params: any) => {
          const button = document.createElement('button');
          button.innerHTML = `
                <i class="pi pi-times text-xs font-light"></i>
                <span class="font-light">Remove</span>
              `;
          button.classList.add(
            'flex',
            'items-center',
            'gap-2',
            'text-rose-300',
            'transition-all'
          );
          button.addEventListener('click', () =>
            params.context.componentParent.deleteRow(params)
          );

          return button;
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

  deletePublicInvestor$ = new Observable();
  createPublicInvestor$ =new Observable();
  updatePublicInvestor$ = new Observable();
  publicInvestors: PublicInvestor[] = [];

  private _publicInvestorService = inject(PublicInvestorsRepositoryService);

  publicInvestors$ = this._publicInvestorService.getInvestors().pipe(
    tap((res) => {
      this.publicInvestors = res;
    })
  );

  updateInvestorDetails(payload: Partial<PublicInvestor>) {
    this.updatePublicInvestor$ = this._publicInvestorService.updateInvestor(
      payload,
      Number(payload.id)
    );
  }

  exportDataAsCSV() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    this.gridApi.exportDataAsCsv({
      columnKeys: this.selectedColumns.length
        ? this.selectedColumns
        : undefined,
      onlySelected: selectedData.length > 0,
      processCellCallback: (params) => {
        if (params.column.getColId() === 'createdAt') {
          return params.node ? params.node.data['created'] : params.value;
        }
        return params.value;
      },
    });
  }

  deleteRow(node: any) {
    this.deletePublicInvestor$ = this._confirmationService
      .confirm(
        `Do you want to remove ${node.data.name}? This action cannot be undone`
      )
      .pipe(
        switchMap((status) => {
          if (status) {
            this.publicInvestors = this.publicInvestors.filter(
              (row) => row.id !== node.data.id
            );
            this.gridApi.applyTransaction({ remove: [node.data] });
            return this._publicInvestorService.removeInvestor(node.data.id);
          }
          return EMPTY;
        })
      );
  }

  showModal() {
    this.visible = true;
  }

  newInvestorForm = this._formBuilder.group({
    name: ['',[ Validators.required]],
    investorType: ['', [Validators.required]],
    minFunding: ['', [Validators.required]],
    maxFunding: ['', [Validators.required]],
    countries: [[], [Validators.required]],
    fundingVehicle: ['', [Validators.required]],
    useOfFunds: [[], [Validators.required]],
    esgFocusAreas: [[], [Validators.required]],
    businessGrowthStages: [[], [Validators.required]],
    investmentStructures: [[], [Validators.required]],
    contactName: ['',],
    contactEmail: [''],
    website: [''],
    sectors: [[], [Validators.required]],
    subSectors: [[], [Validators.required]],
    investees: [''],
  });

  handleSubmit(){
    const values =this.newInvestorForm.value;
    const investees =`${values.investees??''}`.split(',').map(i =>i.trim())
    const payload:Partial<PublicInvestor> ={...values, investees} as Partial<PublicInvestor>
    this.createPublicInvestor$ =this._publicInvestorService.createInvestor(payload).pipe(tap(res =>{
      this.gridApi.applyTransaction({ add: [res] });
      this.newInvestorForm.reset()
      this.visible =false;
    }))
  }
}
