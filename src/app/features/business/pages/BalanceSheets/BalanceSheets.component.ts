import { Component } from '@angular/core';
import {SidenavComponent} from "../../../../core";
import { BusinessLinks } from '../../../../core/utils/business.links';
import { BalanceSheets } from "../../components/FinancialReporting/Balance Sheet/balanceSheets.component";


@Component({
  selector: 'app-balance-sheets-page',
  standalone: true,
  imports: [
    SidenavComponent,
    BalanceSheets
],
  templateUrl: './BalanceSheets.component.html',
  styleUrl: './BalanceSheets.component.scss'
})
export class BalanceSheetsPage {
  links =BusinessLinks
}
