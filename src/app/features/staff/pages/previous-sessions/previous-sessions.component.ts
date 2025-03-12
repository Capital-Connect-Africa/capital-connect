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
  
        {
          field: 'actions',
          cellRenderer: (params: any) => {
            const div =document.createElement('div');
            const remarksButton = document.createElement('button');
            const copyButton = document.createElement('button');
            div.classList.add( 'flex', 'items-center',  'gap-3',);
            remarksButton.innerHTML = `
              <i class="pi pi-comments text-sm font-light" title ="Give remarks"></i>
            `;
            remarksButton.classList.add(
              'flex',
              'items-center',
              'gap-2',
              'text-purple-300',
              'hover:text-purple-500',
              'transition-all'
            );

            copyButton.innerHTML = `
              ${params.context.componentParent.linkCopied? '<i class="pi pi-check text-xs font-light" title ="Copy meeting link"></i>':
              '<i class="pi pi-clone text-sm font-light" title ="Copy meeting link"></i>'}
            `;
            copyButton.classList.add(
              'flex',
              'items-center',
              'gap-2',
              'text-green-300',
              'hover:text-green-500',
              'transition-all'
            );
  
            remarksButton.addEventListener('click', () =>
              params.context.componentParent.giveRemarks(params)
            );

            copyButton.addEventListener('click', () =>
              params.context.componentParent.copyMeetingLink(params)
            );
            div.appendChild(copyButton);
            div.appendChild(remarksButton);
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
        sortable: true
      } as ColDef,
    };
  
    
  ngOnInit(): void {
    this._signalService.pageTitle.set('Previous');
  }

  bookings:CustomBooking[] =[]
  bookings$ =this._bookingService.getBookings(1, 1000).pipe(tap(bookings =>{
    this.bookings =bookings.data.map(booking =>{
      const starts =customFormatDate(new Date(booking.meetingStartTime), !booking.meetingStartTime);
      const stops =customFormatDate(new Date(booking.meetingEndTime), !booking.meetingEndTime);
      return {
        id: booking.id,
        date: booking.meetingStartTime,
        starts: starts.time12hrs,
        stops: stops.time12hrs,
        meetingLink: booking.meetingLink,
        duration: stops.time - starts.time,
        createdAt: booking.createdAt,
        client: (`${booking.user.firstName??''} ${booking.user.lastName??''}`.trim()) ?? '-',
        advisor: (`${booking.advisor.firstName??''} ${booking.advisor.lastName??''}`.trim()) ?? '-',
      }
    })
  }))

  linkCopied =false


  async copyMeetingLink(booking: CustomBooking){
    debugger
    if(this.linkCopied) return;
    await navigator.clipboard.writeText(booking.meetingLink);
    this.linkCopied =true
    setTimeout(() => this.linkCopied =false, 5000)
  }

  giveRemarks(booking: CustomBooking){

  }
}
