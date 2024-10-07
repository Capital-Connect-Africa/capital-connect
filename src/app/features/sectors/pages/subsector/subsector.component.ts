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


  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
    this._router.navigateByUrl(`/sectors/sector/${this.sectorId}`);

  }

  sector!: Sector;
  sectorId!: number;
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


  segments$ = this.getSegments();

  getSegments(){
    console.log("Getting Segments ...")
    return this._activatedRoute.paramMap.pipe(
      switchMap(res => {
        const id = Number((res as any).params.id);
        // console.log("The id is", id)
        this.subsectorId = id;
        return this._sectorsService.getSingleSubsector(id)
      }),
      switchMap((res) => {
        console.log("Res id is", res.id)
        this.subsectorName = res.name;
        return this._sectorsService.getSegmentsOfaSubSector(res.id)
      }), (tap(vals => {
        this.segments = vals;
      })))
  }

  reFetchSegments() {
    this.segments$ = this.getSegments();
  }

}
