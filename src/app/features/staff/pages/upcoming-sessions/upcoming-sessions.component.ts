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
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { customFormatDate, customFormatDuration } from '../../../../core/utils/format.date.util';
import { CustomBooking } from '../../../../shared/interfaces/Billing';
import { castBookingToCustomBooking } from '../../../../core/utils/booking.to.custom.booking';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-upcoming-sessions',
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  templateUrl: './upcoming-sessions.component.html',
  styleUrl: './upcoming-sessions.component.scss'
})


export class UpcomingSessionsComponent {

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
        { field: 'starts', sortable: false, },
        { field: 'stops', sortable: false, },
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
            const joinButton = document.createElement('button');
            const copyButton = document.createElement('button');
            div.classList.add( 'flex', 'items-center',  'gap-3',);
            joinButton.innerHTML = `
              <i class="pi pi-video text-sm font-light" title ="Join Call"></i>
            `;
            joinButton.classList.add(
              'flex',
              'items-center',
              'gap-2',
              'text-blue-300',
              'hover:text-blue-500',
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

            joinButton.addEventListener('click', () => 
              params.context.componentParent.joinCall(params.data)
            );

            copyButton.addEventListener('click', () =>
              params.context.componentParent.copyMeetingLink(params.data)
            );
  
            div.appendChild(joinButton);
            div.appendChild(copyButton);
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
    this._signalService.pageTitle.set('Scheduled');
  }

  bookings:CustomBooking[] =[]
  bookings$ =this._bookingService.getBookings(1, 1000).pipe(tap(res =>{
    const bookings =res.data;
    this.bookings =bookings.filter(booking =>new Date(booking.meetingStartTime).getTime() > new Date().getTime()).map(booking =>castBookingToCustomBooking(booking) as CustomBooking)
  }))

  joinCall(booking: CustomBooking){
    if(!booking.meetingLink){
      alert('Meeting has no link')
      return
    }
    window.open(booking.meetingLink, '_blank');
  }


  async copyMeetingLink(booking: CustomBooking){
    if(!booking.meetingLink){
      alert('Meeting has no link')
      return
    }
    await navigator.clipboard.writeText(booking.meetingLink);
    alert('Link copied to clipboard')
  }
}
