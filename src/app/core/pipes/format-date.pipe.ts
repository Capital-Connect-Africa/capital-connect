import { Pipe, PipeTransform } from '@angular/core';
import { customFormatDate } from '../utils/format.date.util';

enum DATE_FORMAT {
    MMDD ='mmdd'
}

@Pipe({
    standalone: true,
    name: 'format_date',
})

export class FormatDatePipe implements PipeTransform {
  transform(value: Date, format:DATE_FORMAT =DATE_FORMAT.MMDD): string {
    return customFormatDate(new Date(value), !value)[format]
  }
}
