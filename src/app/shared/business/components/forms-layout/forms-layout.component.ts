import { Component, Input } from '@angular/core';
import { BusinessPageService } from '../../../../features/business/services/business-page/business.page.service';
import { ProgressBarComponent } from '../../../../core/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-forms-layout',
  standalone: true,
  imports: [ProgressBarComponent],
  templateUrl: './forms-layout.component.html',
  styleUrl: './forms-layout.component.scss'
})
export class FormsLayoutComponent {
  current_step = 1;
  current_page = 2;

  @Input() progress_steps = [
    { name: 'Investor Eligibility' },
    { name: 'Investor Preparedness' },
    { name: 'Business Information', },
    { name: 'Impact Assessment' },
  ];

  constructor(private businessPageService: BusinessPageService) { }

  @Input() steps: number = 4;
  @Input() title: string = '';
  @Input() progress = 0;
  setNextScreen(step: number) {
    this.setNextStep(step);
    if (this.current_step > this.steps || (this.current_step < 1 && step < 0)) {
      this.current_step = 1;
      this.current_page += step;
      this.businessPageService.setCurrentStep(this.current_step);
      this.businessPageService.setCurrentPage(this.current_page);
    }
  }

  setNextStep(step = 1) {
    if ((step < 0 && this.current_step < 1) || (step > 0 && this.current_step > this.steps)) return;
    this.current_step += step;
    this.businessPageService.setCurrentStep(this.current_step);
  }
}
