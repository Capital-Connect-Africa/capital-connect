import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalsService } from '../../../../core/services/signals/signals.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _signalService =inject(SignalsService);

  ngOnInit(): void {
    this._signalService.pageTitle.set('Dashboard');
  }

}
