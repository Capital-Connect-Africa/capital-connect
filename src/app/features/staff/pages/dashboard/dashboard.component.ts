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
    this._signalService.pageTitle.set('Overview');
  }


  stats =[
    {
      icon: 'pi pi-video',
      heading: 'Total',
      theme: 'bg-purple-800',
      paragraph: '1k advisory sessions',
      action: () =>{}
    },
    {
      icon: 'pi pi-calendar-clock',
      heading: 'Upcoming',
      theme: 'bg-teal-800',
      paragraph: '200 scheduled sessions',
      action: () =>{}
    },
    {
      icon: 'pi pi-wallet',
      heading: 'Revenue',
      theme: 'bg-blue-800',
      paragraph: '$10M revenue generated',
      action: () =>{}
    },
    {
      icon: 'pi pi-briefcase',
      heading: 'Businesses',
      theme: 'bg-green-800',
      paragraph: '50 businesses advised',
      action: () =>{}
    },
  ]

}
