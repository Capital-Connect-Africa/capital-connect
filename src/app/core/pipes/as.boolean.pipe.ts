import { formatDistanceToNow } from 'date-fns';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'as_boolean',
})

export class AsBooleanPipe implements PipeTransform {
  transform(value: any): boolean {
    return value as boolean
  }
}
