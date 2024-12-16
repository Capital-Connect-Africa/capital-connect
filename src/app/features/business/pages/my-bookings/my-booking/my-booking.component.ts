import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../../core";
import { BusinessLinks } from '../../../../../core/utils/business.links';
import { MyBookingComponent } from '../../../components/my-bookings/main/my-booking/main/booking.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    MyBookingComponent,
    SidenavComponent
  ],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.scss'
})
export class BookingComponent {
  //booleans
  advisor:boolean = false
  // links = []

  constructor(){
    const userProfile = sessionStorage.getItem('userProfile');
    if(userProfile){  
      if(JSON.parse(userProfile).roles==="advisor"){
        this.advisor = true
        this.links = this.advisor ? 
        [ { label: 'Sessions', href: '/advisor', exact: false, icon: 'grid_view' ,display:true } ] : BusinessLinks

      }
    }
  }
  links = BusinessLinks


}
