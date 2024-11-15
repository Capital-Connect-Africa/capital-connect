import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";

@Component({
  selector: 'app-billing-vouchers',
  standalone: true,
  imports: [AdminUiContainerComponent],
  templateUrl: './billing-vouchers.component.html',
  styleUrl: './billing-vouchers.component.scss'
})
export class BillingVouchersComponent {

}
