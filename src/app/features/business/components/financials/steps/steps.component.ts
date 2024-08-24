import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepOneComponent } from '../step-one/step-one.component';
import { StepTwoComponent } from '../step-two/step-two.component';
import { StepThreeComponent } from '../step-three/step-three.component';
import { BusinessPageService } from '../../../services/business-page/business.page.service';
import { ProgressBarComponent } from '../../../../../core/components/progress-bar/progress-bar.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-steps',
  standalone: true,
  styleUrl: './steps.component.scss',
  templateUrl: './steps.component.html',
  imports: [CommonModule, ProgressBarComponent, StepOneComponent, StepTwoComponent, StepThreeComponent],
})
export class StepsComponent {
  current_step = 1;
  constructor(private businessPageService: BusinessPageService) { }

  currentStep$ = this.businessPageService.current_step$.pipe(tap(step => {
    this.current_step = step;
  }))
}
