import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { SharedModule } from './shared';
import { LoadingComponent } from './core/components/loading/loading.component';
import { FeedbackNotificationComponent, LoadingService } from './core';
import { DataLayerService } from './core/services/analytics/data.layer.service';
import { ZendeskService } from './core/services/intergrations/zendesk.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule, LoadingComponent, FeedbackNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private _dataLayerService =inject(DataLayerService);
  private _loadingService = inject(LoadingService);
  private _cd = inject(ChangeDetectorRef);
  private _router =inject(Router);
  private _zenDeskService = inject(ZendeskService)

  routerEvents$ =new Observable<any>();

  isLoading = true;

  ngOnInit(): void {
    this.routerEvents$ =this._router.events.pipe(tap(event =>{
        if(event instanceof NavigationEnd) 
          this._dataLayerService.logPageView(event.urlAfterRedirects);
    }));
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

  openChat() {
    this._zenDeskService.openChat();
  }

  closeChat() {
    this._zenDeskService.closeChat();
  }

  setUser() {
    this._zenDeskService.setVisitorInfo('John Doe', 'john.doe@example.com');
  }

}
