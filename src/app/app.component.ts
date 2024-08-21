import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { SharedModule } from './shared';
import { LoadingComponent } from './core/components/loading/loading.component';
import { FeedbackNotificationComponent, LoadingService } from './core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, LoadingComponent, FeedbackNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private _loadingService = inject(LoadingService);
  private _cd = inject(ChangeDetectorRef);

  isLoading = true;

  ngOnInit(): void {
    this._trackLoadingStatusSubscription();
  }


  private _trackLoadingStatusSubscription() {
    return this._loadingService.loading$.pipe(distinctUntilChanged()).subscribe(res => {
      this.isLoading = res;
      this._cd.detectChanges();
    })
  }

  ngOnDestroy(): void {
    this._trackLoadingStatusSubscription().unsubscribe()
  }

}
