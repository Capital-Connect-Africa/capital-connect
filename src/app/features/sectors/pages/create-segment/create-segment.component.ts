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

@Component({
  selector: 'app-create-subsector',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, UiComponent
  ],
  templateUrl: './create-segment.component.html',
  styleUrl: './create-segment.component.scss'
})
export class CreateSegmentComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _formStateService = inject(FormStateService);
  private _router = inject(Router);
  private _sectorService = inject(SectorsService);
  private _feedBackService = inject(FeedbackService)


  //streams
  submit$ = new Observable<unknown>() 
  sector!: Sector;
  subSectorId!: number;

  segmentForm = this._fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  init$= this._activatedRoute.paramMap.pipe(tap((res) => {
    // @ts-ignore
    const id = Number(res.params['id']);
    this.subSectorId = id;
    this._sectorService.getSingleSector(id).pipe(tap(vals => {
      this.sector = vals;
    })).subscribe()
  }))



  isSegmentFormValid$ = this._formStateService.subsectorFormIsValid$.pipe(tap(isValid => {
    this.isSegmentFormValid = isValid;
  }));

  isSegmentFormValid = false;

  submit() {
    let data = {
      name : this.segmentForm.value.name as string,
      description: this.segmentForm.value.description as string,
      subSectorId: this.subSectorId
    }
    this.submit$ = this._sectorService.createSegment(data).pipe(tap(res=>{
      this._feedBackService.success("Segment Created Successfully")
    }))


  }

  cancel() {
    this._router.navigateByUrl(`/sectors/sub-sector/${this.subSectorId}`);
  }
}
