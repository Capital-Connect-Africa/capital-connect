import { Component, inject } from '@angular/core';
import { Sector, SubSectorInput } from "../../interfaces";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormStateService } from "../../services/form-state/form-state.service";
import { SectorsService } from "../../services/sectors/sectors.service";
import { CommonModule } from "@angular/common";
import { Observable, tap } from "rxjs";
import { UiComponent } from "../../components/ui/ui.component";
import { FeedbackService } from '../../../../core';
import { Segment } from 'chart.js/dist/helpers/helpers.segment';
import { SectorSignalStoreService } from '../../../../store/sector-store.service';

@Component({
  selector: 'app-create-subsector',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, UiComponent
  ],
  templateUrl: './edit-segment.component.html',
  styleUrl: './edit-segment.component.scss'
})
export class EditSegmentComponet {
  private _activatedRoute = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _formStateService = inject(FormStateService);
  private _router = inject(Router);
  private _sectorService = inject(SectorsService);
  private _feedBackService = inject(FeedbackService)
  private _sectorSignalStore = inject(SectorSignalStoreService);


  sectorId: number | null | undefined;

  //streams
  submit$ = new Observable<unknown>() 
  sector!: Sector;
  subSectorId!: number;
  segmentId!:number;
  segment$ = new Observable<unknown>()
  segment!:Segment;

  segmentForm = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  init$= this._activatedRoute.paramMap.pipe(tap((res) => {
    // @ts-ignore
    const id = Number(res.params['id']);
    this.segmentId = id;

    this.segment$ = this._sectorService.getSegment(this.segmentId).pipe(tap(res=>{
      this.segmentForm.patchValue({
        name: res.name,
        description: res.description
      });
      
    }))

  }))

  init2$= this._activatedRoute.paramMap.pipe(tap((res) => {
    // @ts-ignore
    this.subSectorId = Number(res.params['subSectorId'])
  }))








  isSegmentFormValid$ = this._formStateService.subsectorFormIsValid$.pipe(tap(isValid => {
    this.isSegmentFormValid = isValid;
  }));

  isSegmentFormValid = false;

  submit() {
    let data = {
      name : this.segmentForm.value.name as string,
      description: this.segmentForm.value.description as string,
    }
    this.submit$ = this._sectorService.updateSegment(this.segmentId, data ).pipe(tap(res=>{
      this._feedBackService.success("Segment Updated Successfully")
    }))


  }


  ngOnInit(): void {
    // Retrieve the sectorId from the signal store
    this.sectorId = this._sectorSignalStore.sectorId;

  }


  cancel() {
    this._router.navigateByUrl(`/sectors/sub-sector/${this.subSectorId}`);
  }
}
