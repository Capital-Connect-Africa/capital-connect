import { ApplicationConfig, importProvidersFrom,APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { AuthInterceptor } from './shared/interceptors/token.interceptor';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { FeatureFlagsStoreService } from './store/feature-flags-store.service';

export function initializeFeatureFlags(featureFlagsStore: FeatureFlagsStoreService): () => Promise<void> {
  return () => featureFlagsStore.loadFlags();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFeatureFlags,
      deps: [FeatureFlagsStoreService],
      multi: true,
    },
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(MatDialogModule, MatIconModule),
    provideHttpClient(withInterceptors([HttpErrorInterceptor, AuthInterceptor, LoadingInterceptor])), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
