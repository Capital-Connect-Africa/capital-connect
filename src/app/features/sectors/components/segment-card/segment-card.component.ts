import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Observable, of, switchMap, tap } from "rxjs";
import { SectorsService } from "../../services/sectors/sectors.service";
import { RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { ConfirmationService, FeedbackService } from "../../../../core";

@Component({
  selector: 'app-segment-card',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    CommonModule
  ],
  templateUrl: './segment-card.component.html',
  styleUrl: './segment-card.component.scss'
})
export class SegmentCardComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() segmentId!: number;
  @Output() refreshSegmentEvent = new EventEmitter();

  private _sectorService = inject(SectorsService);
  private _confirmationService = inject(ConfirmationService);
  private _feedBackService = inject(FeedbackService);

  delete$ = new Observable();

  deleteSubsector(sectorId: number) {
    this.delete$ = this._confirmationService.confirm('Are you sure to delete this subsector?').pipe(switchMap(confirmation => {
      if (confirmation) {
        return this._sectorService.removeSubSector(sectorId);
      }
      return of(null);
    }), tap(confirmation => {
      if (confirmation) {
        this._feedBackService.success('Subsector was removed successfully!');
        this.refreshSegmentEvent.emit(true);
      }
    }))

  }
}
