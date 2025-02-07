import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'slice_text',
})
export class SliceTextPipe implements PipeTransform {
  transform(text: string, maxLength: number = 60): string {
    return (
      (text && text.length > maxLength
        ? `${text.slice(0, maxLength)}...`
        : text) ?? ''
    );
  }
}
