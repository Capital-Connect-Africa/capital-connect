import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from '../../components/admin-ui-container/admin-ui-container.component';
import { PieChartComponent } from '../../../../shared/components/charts/pie-chart/pie-chart.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { ReferralsService } from '../../services/referrals.service';
import { ReferralLinkComponent } from '../../../../shared/components/referral-link/referral-link.component';
import { ReferralLeader } from '../../interfaces/referral.leader.interface';
import { ReferralStats } from '../../interfaces/referral.stats.interface';
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

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [
    AdminUiContainerComponent,
    CommonModule,
    TableModule,
    AgGridAngular,
    ReferralLinkComponent,
  ],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss',
})
export class ReferalsComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _referralsService = inject(ReferralsService);
  total_records: number = 0;
  cols = [
    { header: 'RNK', field: 'rank' },
    { header: 'User', field: 'name' },
    { header: 'Clicks', field: 'clicks' },
    { header: 'Visits', field: 'visits' },
    { header: 'Signups', field: 'signups' },
    { header: 'Rate', field: 'rate' },
  ];
  referrals: ReferralLeader[] = [];

  private gridApi!: GridApi<ReferralLeader>;
  selectedColumns: string[] = [];
  theme = themeMaterial
    .withPart(iconSetMaterial)
    .withPart(colorSchemeDarkBlue)
    .withParams({
      iconSize: 18,
      headerTextColor: 'white',
      rowHoverColor: 'rgba(255, 255, 255, 0.05)',
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

  

  gridOptions: GridOptions = {
    pagination: true,
    theme: this.theme,
    onGridReady: (params) => {
      this.gridApi = params.api;
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
    ] as ColDef[],
    defaultColDef: {
      flex: 1,
    } as ColDef,
  };
}
