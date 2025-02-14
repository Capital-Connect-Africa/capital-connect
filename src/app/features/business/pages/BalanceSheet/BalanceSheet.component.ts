import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import {BookingComponent} from "../../components/my-bookings/main/booking.component";
import { BusinessLinks } from '../../../../core/utils/business.links';
import { FinancialReporting } from "../../components/FinancialReporting/booking.component";
import { BalanceSheet } from "../../components/FinancialReporting/Balance Sheet/ViewBalanceSheet/balanceSheet.component";

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    SidenavComponent,
    BalanceSheet
],
  templateUrl: './BalanceSheet.component.html',
  styleUrl: './BalanceSheet.component.scss'
})
export class BalanceSheetPage {
  links =BusinessLinks
}
