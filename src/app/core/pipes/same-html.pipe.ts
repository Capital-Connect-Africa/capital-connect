import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    standalone: true,
    name: 'safe_html',
})

export class SafeHtmlPipe implements PipeTransform {
    private _sanitizer =inject(DomSanitizer)
    transform(value: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(value)
    }
}
