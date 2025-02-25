import { Component, inject, ViewChild } from '@angular/core';
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
import { fixNumber } from '../../../../core/utils/fix-number.util';
import { DataFilePreviewComponent } from "../../components/data-file-preview/data-file-preview.component";

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
    ReactiveFormsModule,
    DataFilePreviewComponent
],
  templateUrl: './public-investors-repository.component.html',
  styleUrl: './public-investors-repository.component.scss',
})
export class PublicInvestorsRepositoryComponent {
  visible = false;
  file!:File;
  @ViewChild('fileInput') fileInput: any;
  selectedPublicInvestor:PublicInvestor | null =null;
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
      wrapperBorderRadius: '.5rem',
      headerTextColor: 'dodgerblue',
      headerCellHoverBackgroundColor: 'rgba(80, 40, 140, 0.66)',
      headerCellMovingBackgroundColor: 'rgb(80, 40, 140)',
      selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
      rowHoverColor: 'transparent',
    });

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    getRowId: (params) => params.data.id,
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    onCellValueChanged: (cell) => {
      if (!cell.newValue) return;
      const payload: Partial<PublicInvestor> = {
        [cell.column.getColId()]: cell.newValue,
      };

      this.updateInvestorDetails(payload, Number(cell.data.id));
    },
    columnDefs: [
      { field: 'id', hide: true, sort: 'desc' },
      { field: 'name', pinned: 'left', editable: true },
      { field: 'type', editable: true },
      {
        field: 'minFunding',
        editable: true,
        valueFormatter: (params: ValueFormatterParams) => {
          return '$' + formatCurrency(params.value);
        },
      },
      {
        field: 'maxFunding',
        editable: true,
        valueFormatter: (params: ValueFormatterParams) => {
          return '$' + formatCurrency(params.value);
        },
      },
      { field: 'countries' },
      { field: 'fundingVehicle', editable: true },
      { field: 'useOfFunds' },
      { field: 'esgFocusAreas' },
      { field: 'businessGrowthStages' },
      { field: 'investmentStructures' },
      { field: 'contactName',  },
      { field: 'contactEmail' },
      { field: 'website', editable: true },
      { field: 'sectors' },
      { field: 'subSectors' },
      { field: 'investees' },
      { field: 'description', editable: true },
      {
        field: 'createdAt',
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
          const div =document.createElement('div');
          const editButton = document.createElement('button');
          const deleteButton = document.createElement('button');
          div.classList.add(
            'flex',
            'items-center',
            'gap-3',
          );
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
          editButton.innerHTML = `
            <i class="pi pi-pencil text-xs font-light"></i>
            <span class="font-light">Edit</span>
          `;
          editButton.classList.add(
            'flex',
            'items-center',
            'gap-2',
            'text-green-300',
            'hover:text-green-500',
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
        width: 200,
        editable: false,
        sortable: false,
        filter: false,
      },
    ] as ColDef[],
    defaultColDef: {
      filter: true,
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

  selectInvestor(node:any){
    const data =node.data;
    this.selectedPublicInvestor =data;
    this.visible =true;
    this.newInvestorForm.reset();
    this.subSectors =this.selectedPublicInvestor?.sectors.map(sector =>{
      return this.allSectors.find(s => s.name ==sector)?.subSectors?.map(sb =>sb.name);
    }).flat() as string[];

    this.newInvestorForm.patchValue({
        name: data.name,
        investorType: data.type,
        minFunding: fixNumber(Number(data.minFunding)),
        maxFunding: fixNumber(Number(data.maxFunding)),
        countries: data.countries ?? [],
        fundingVehicle: data.fundingVehicle,
        useOfFunds: data.useOfFunds ?? [],
        esgFocusAreas: data.esgFocusAreas,
        businessGrowthStages:data.businessGrowthStages ?? [],
        investmentStructures: data.investmentStructures ?? [],
        contactName: data.contactName.join(','),
        contactEmail:data.contactEmail.join(','),
        website: data.website,
        sectors: data.sectors ?? [],
        subSectors: (data.subSectors ?? []),
        investees: (data.investees ?? []).join(','),
        description: data.description,
    })
  }

  updateInvestorDetails(payload: Partial<PublicInvestor>, investorId:number) {
    this.updatePublicInvestor$ = this._publicInvestorService.updateInvestor(
      payload,
      investorId
    ).pipe(tap(res =>{
      this.reset();
      this.gridApi.applyTransaction({ update: [res] });
    }));
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
    this.reset();
    this.visible = true;
  }

  newInvestorForm = this._formBuilder.group({
    name: ['', [Validators.required]],
    investorType: ['', [Validators.required]],
    minFunding: ['', [Validators.required, Validators.min(0)]],
    maxFunding: ['', [Validators.required, Validators.min(0)]],
    countries: [[], [Validators.required]],
    fundingVehicle: ['', [Validators.required]],
    useOfFunds: [[], [Validators.required]],
    esgFocusAreas: [[], [Validators.required]],
    businessGrowthStages: [[], [Validators.required]],
    investmentStructures: [[], [Validators.required]],
    contactName: ['',],
    contactEmail: ['',],
    website: [''],
    sectors: [[], [Validators.required]],
    subSectors: [[], [Validators.required]],
    investees: [''],
    description: [''],
  });

  handleSubmit(){
    const values =this.newInvestorForm.value;
    const investees =`${values.investees??''}`.split(',').map(i =>i.trim());
    const contactName =`${values.contactName??''}`.split(',').map(i =>i.trim());
    const contactEmail =`${values.contactEmail??''}`.split(',').map(i =>i.trim());
    const payload:Partial<PublicInvestor> ={...values, contactName, contactEmail, investees} as Partial<PublicInvestor>
    if(this.selectedPublicInvestor){
      return this.updateInvestorDetails(payload, this.selectedPublicInvestor.id)
    }
    this.createPublicInvestor$ =this._publicInvestorService.createInvestor(payload).pipe(tap(res =>{
      this.gridApi.applyTransaction({ add: [res] });
      this.reset();
    }))
  }

  reset(){
    this.newInvestorForm.reset();
    this.selectedPublicInvestor =null;
    this.visible =false;
  }

  uploadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    this.file = target.files[0];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getUploadedData(payload:PublicInvestor[]){
    this.publicInvestors =[...this.publicInvestors, ...payload]
  }
}
