import { Component, inject } from '@angular/core';
import { DealsPipelinesStore } from '../../../../deals-pipeline/store/deals.pipelines.store';
import { Deal } from '../../../../deals-pipeline/interfaces/deal.interface';
import { formatCurrency } from '../../../../../core/utils/format.currency';
import { CommonModule } from '@angular/common';
import { NumberAbbriviationPipe } from '../../../../../core/pipes/number-abbreviation.pipe';
import { DealStage } from '../../../../deals-pipeline/interfaces/deal.stage.interface';
import { FormatDatePipe } from "../../../../../core/pipes/format-date.pipe";
import { ChildEventsService } from '../../../../deals-pipeline/services/child.events.service';

@Component({
  selector: 'deals-kanban-view',
  standalone: true,
  imports: [CommonModule, NumberAbbriviationPipe, FormatDatePipe],
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.scss'
})

export class KanbanViewComponent {
  store =inject(DealsPipelinesStore);
  private _childEventsService =inject(ChildEventsService)
  src:DealStage | null =null;
  target: Deal | null =null;

  getTotalDealsValue(deals:Deal[]){
    return formatCurrency(deals.reduce((prev, curr) => prev +Number(curr.value), 0))
  }

  async handleDrop(event:Event, stage:DealStage){
    if(!this.src || ! this.target || (this.src && stage.id === this.src.id)) return;
    await this.store.updateDealStage(this.src, stage, this.target.id);
    this._childEventsService.emitDealStageChangeEvent();
  }

  handleDragOver(event: DragEvent){
    event.preventDefault()
  }

  handleDragStart(event: DragEventInit, deal:Deal, stage:DealStage){
    this.src =stage;
    this.target =deal
  }

  selectDeal(deal:Deal){
    this.store.setCurrentlySelectedDeal(deal);
    this._childEventsService.emitDealSelectedEvent('Read')
  }
}
