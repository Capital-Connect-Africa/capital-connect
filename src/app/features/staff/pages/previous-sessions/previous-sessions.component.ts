import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../../core/services/signals/signals.service';
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
import { formatDistanceToNow } from 'date-fns';
import { BookingsService } from '../../../advisor/services/booking.service';
import { of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { customFormatDate, customFormatDuration } from '../../../../core/utils/format.date.util';
import { CustomBooking } from '../../../../shared/interfaces/Billing';
import { castBookingToCustomBooking } from '../../../../core/utils/booking.to.custom.booking';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-previous-sessions',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './previous-sessions.component.html',
  styleUrl: './previous-sessions.component.scss'
})


export class PreviousSessionsComponent {

  private _signalService =inject(SignalsService);
  private _bookingService = inject(BookingsService);

   private gridApi!: GridApi<any>;
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
      getRowId: (params) => `${params.data.id}`,
      onGridReady: (params) => {
        this.gridApi = params.api;
      },
      columnDefs: [
        { 
          field: 'date', 
          pinned: 'left', 
          sort: 'desc',
          valueFormatter: (params: ValueFormatterParams) => {
            return customFormatDate(new Date(params.value), !params.value).wdddmmyr;
          },
        },
        { field: 'starts', headerName: 'Begun', sortable: false, },
        { field: 'stops', headerName: 'Ended', sortable: false, },
        { 
          field: 'duration',  
          valueFormatter: (params: ValueFormatterParams) => {
            return params.value? customFormatDuration(params.value): '-';
          },
        },
        { field: 'client' },
        { field: 'advisor' },
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
      ] as ColDef[],
      defaultColDef: {
        filter: true,
        sortable: true
      } as ColDef,
    };
  
    
  ngOnInit(): void {
    this._signalService.pageTitle.set('Previous');
  }

  bookings:CustomBooking[] =[]
  bookings$ =this._bookingService.getBookings(1, 1000).pipe(tap(res =>{
    const bookings =res.data;

    this.bookings =bookings.filter(booking =>new Date(booking.meetingStartTime).getTime() < new Date().getTime()).map(booking =>castBookingToCustomBooking(booking) as CustomBooking)
  }))

}
