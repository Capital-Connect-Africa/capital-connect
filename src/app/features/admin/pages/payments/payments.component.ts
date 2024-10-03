import { Component, inject } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { Observable, tap } from 'rxjs';
import { Payment } from '../../../../shared/interfaces/Billing';
import { UserStatisticsService } from '../../services/user.statistics.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [AdminUiContainerComponent, CommonModule, TableModule, NumberAbbriviationPipe, TimeAgoPipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {
  private _paymentsService =inject(UserStatisticsService);
  payments: Payment[] =[];
  cols =[
    { field: 'id', header: 'PID' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
    { field: 'createdAt', header: 'Date' },
    { field: 'description', header: 'Reason' },
  ]

  payments$ =new Observable<any>()

  getPayments(page: number =1, limit:number =10){
    this.payments$ =this._paymentsService.getPayments(page, limit).pipe(tap(res =>{
      this.payments =res;
    }))
  }

  ngOnInit(): void {
    this.getPayments();
  }
}
