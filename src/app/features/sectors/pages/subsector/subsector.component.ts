import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiComponent } from "../../components/ui/ui.component";
import { SectorsService } from '../../services/sectors/sectors.service';
import { QuestionCardComponent } from '../../../questions/components/question-card/question-card.component';
import { Sector, SubSector } from '../../interfaces';
import { Location } from '@angular/common';
import { SegmentCardComponent } from '../../components/segment-card/segment-card.component';
import { Router } from '@angular/router';
import { Segment } from '../../interfaces';
import { SectorSignalStoreService } from '../../../../store/sector-store.service';

@Component({
  selector: 'app-subsector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    UiComponent,
    QuestionCardComponent,
    RouterLink,
    SegmentCardComponent
  ],
  templateUrl: './subsector.component.html',
  styleUrl: './subsector.component.scss'
})
export class SubSectorComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _sectorsService = inject(SectorsService);
  private _router = inject(Router);
  private _sectorSignalStore = inject(SectorSignalStoreService);





  sector!: Sector;
  sectorId: number | null | undefined;
  subsectorName!: string;
  routeId!: string;

  segments!: Segment[]
  subsectorId!: number;


  sectionId!: number;

  init$ = this._activatedRoute.params.pipe(switchMap((res) => {
    this.routeId = res['id'].trim();
    const ids = this.routeId.split('-');
    this.sectionId = Number(ids.at(0))
    this.sectorId = Number(ids.at(1));
    return this._sectorsService.getSingleSubsector(this.sectorId);

  }), tap((subsectorInfo) => {
    this.subsectorName = subsectorInfo.name;
  }))


  ngOnInit(): void {
    // Retrieve the sectorId from the signal store
    this.sectorId = this._sectorSignalStore.sectorId;

  }

  goBack(): void {
    this._router.navigateByUrl(`/sectors/sector/${this.sectorId}`);
  }



  segments$ = this.getSegments();

  getSegments(){

    return this._activatedRoute.paramMap.pipe(
      switchMap(res => {
        const id = Number((res as any).params.id);
        this.subsectorId = id;
        return this._sectorsService.getSingleSubsector(id)
      }),
      switchMap((res) => {
        this.subsectorName = res.name;
        return this._sectorsService.getSegmentsOfaSubSector(res.id)
      }), (tap(vals => {
        this.segments = vals;
      })))
  }

  reFetchSegments() {
    alert("Referct segmetns called")
    this.segments$ = this.getSegments();
  }

}
