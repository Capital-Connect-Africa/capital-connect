import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from '../../components/admin-ui-container/admin-ui-container.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { ReferralsService } from '../../services/referrals.service';
import { ReferralLinkComponent } from '../../../../shared/components/referral-link/referral-link.component';
import { ReferralLeader } from '../../interfaces/referral.leader.interface';

import { AllCommunityModule, ModuleRegistry, themeMaterial, colorSchemeLightCold , ColDef, GridOptions, ValueFormatterParams, iconSetMaterial, GridApi,} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { User } from '../../../users/models';

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [ AdminUiContainerComponent, CommonModule, TableModule, AgGridAngular, ReferralLinkComponent, ModalComponent],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss',
})
export class ReferalsComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _referralsService = inject(ReferralsService);
  total_records: number = 0;
  referrals: ReferralLeader[] = [];

  //booleans
  showReffers:boolean = false

  //vars
  refferedusers!:User[]
  currentUser!:string

  private gridApi!: GridApi<ReferralLeader>;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withPart(colorSchemeLightCold)
    .withParams({
      iconSize: 18,
      headerTextColor: 'black',
      rowHoverColor: 'rgba(0, 0, 0, 0.05)',
      wrapperBorderRadius: '.5rem',
    });
  stats: any[] =[]
  referrals$ = new Observable();
  stats$ = new Observable();

  ngOnInit() {
    this.getLeadersBoard();
    this.getStats();
  }

  getLeadersBoard(page = 1, limit = 1000) {
    this.referrals$ = this._referralsService.getLeadersBoard(page, limit).pipe(
      tap((referrals) => {
        this.referrals = referrals.referrals;
        this.total_records = referrals.total_count;
      })
    );
  }

  getStats() {
    this.stats$ = this._referralsService.getStats().pipe(
      tap((stats) => {
        this.stats = [
          {
            name: 'Clicks',
            count: stats.clicks ??0,
            icon: 'pi pi-bolt',
          },
          {
            name: 'Visits',
            count: stats.visits ??0,
            icon: 'pi pi-wave-pulse',
          },
          {
            name: 'Signups',
            count: stats.signups ??0,
            icon: 'pi pi-briefcase',
          },
          {
            name: 'Signup Rate',
            count: `${Math.round(stats.rate ??0)}%`,
            icon: 'pi pi-chart-scatter',
          }
        ]
      })
    );
  }


  viewReferrerDetails(data: any){
    this.showReffers = true
    console.log(this.showReffers)
    this.refferedusers = data.refferers
    this.currentUser = data.name
    console.log("The refferers are ... ", data)
  }
  

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
    onCellClicked: (event) => {
      if (event.colDef.field === 'referrers') {
        this.viewReferrerDetails(event.data);
      }
    },
    columnDefs: [
      { field: 'rank', sort: 'asc' },
      { field: 'name' },
      { field: 'clicks' },
      { field: 'visits' },
      { field: 'signups' },
      {
        field: 'rate',
        headerName: 'Signup Rate',
        valueFormatter: (params: ValueFormatterParams) => {
          return `${Math.round(params.value)}%`;
        },
      },
      {
        field: 'referrers',
        headerName: 'Referees',
        cellRenderer: (params: { data: any; }) => {
          const button = document.createElement('button');
          button.innerHTML = '<i class="material-icons" style="font-size:15px; color:#007bff;">visibility</i>';
          button.style.border = 'none';
          button.style.background = 'none';
          button.style.cursor = 'pointer';
          return button;
        }
      }
      

    ] as ColDef[],
    defaultColDef: {
      flex: 1,
    } as ColDef,
  };
}
