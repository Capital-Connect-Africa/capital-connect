import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../core';
import { SignalsService } from '../../core/services/signals/signals.service';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _loadingService = inject(LoadingService);
  const _signalsService =inject(SignalsService);
  _loadingService.setLoading(true);
  return next(req).pipe(
    finalize(() => {
      if(!_signalsService.fileUploading())
        _loadingService.setLoading(false);
    })
  );
}
