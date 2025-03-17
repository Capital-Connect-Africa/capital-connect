import { Component, inject } from '@angular/core';
import { DealsPipelinesStore } from '../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { Deal } from '../../../deals-pipeline/interfaces/deal.interface';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, TimeAgoPipe],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss'
})
export class DealsComponent {

  store =inject(DealsPipelinesStore);

  getTotalDealsValue(deals:Deal[]){
    return formatCurrency(deals.reduce((prev, curr) => prev +Number(curr.value), 0))
  }
}
