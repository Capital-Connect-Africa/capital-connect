import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { PaymentTabs } from '../../interfaces/payment.tabs.enum';
import { CommonModule } from '@angular/common';
import { BookingDetailComponent } from '../../components/bookings/booking-detail/booking-detail.component';

@Component({
  selector: 'app-single-booking',
  standalone: true,
  imports: [CommonModule, AdminUiContainerComponent, BookingDetailComponent],
  templateUrl: './single-booking.component.html',
  styleUrl: './single-booking.component.scss'
})
export class SingleBookingComponent {
  tabs =PaymentTabs;
  activeTab: PaymentTabs =PaymentTabs.DETAILS;
  setActiveTab(tab: PaymentTabs){
    this.activeTab =tab;
  }
}
