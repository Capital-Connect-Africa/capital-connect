import { Component, inject } from '@angular/core';
import { DealsPipelinesStore, PipelineViews } from '../../../deals-pipeline/store/deals.pipelines.store';
import { CommonModule } from '@angular/common';
import { Deal } from '../../../deals-pipeline/interfaces/deal.interface';
import { formatCurrency } from '../../../../core/utils/format.currency';
import { NumberAbbriviationPipe } from "../../../../core/pipes/number-abbreviation.pipe";
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { KanbanViewComponent } from "../../components/deals/kanban-view/kanban-view.component";
import { ListViewComponent } from "../../components/deals/list-view/list-view.component";

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, KanbanViewComponent, ListViewComponent],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss'
})
export class DealsComponent {

  store =inject(DealsPipelinesStore);
  views =PipelineViews
}
