import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { BusinessLinks } from '../../../../core/utils/business.links';
import { CashFlowComponent } from '../../components/FinancialReporting/Cash Flow/cashFlow.component';

@Component({
  selector: 'app-cash-flow-page',
  standalone: true,
  imports: [
    SidenavComponent,
    CashFlowComponent
],
  templateUrl: './cashFlow.component.html',
  styleUrl: './cashFlow.component.scss'
})
export class CashFlowPage {
  links =BusinessLinks
}
