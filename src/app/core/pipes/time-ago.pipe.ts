import { formatDistanceToNow } from 'date-fns';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'time_ago',
})

export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | any): string {
    return formatDistanceToNow(new Date(value),{addSuffix: true});
  }
}
