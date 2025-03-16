import { Component, inject } from '@angular/core';
import { DealsPipelinesStore } from '../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { Deal } from '../../../deals-pipeline/interfaces/deal.interface';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss'
})
export class DealsComponent {

  store =inject(DealsPipelinesStore);

  getTotalDealsValue(deals:Deal[]){
    return deals.reduce((prev, curr) => prev +curr.value, 0)
  }
}
