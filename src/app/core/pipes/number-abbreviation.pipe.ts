import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '../utils/format.currency';

@Pipe({
  name: 'numberabbreviation',
  standalone: true
})
export class NumberAbbriviationPipe implements PipeTransform {

  transform(value: number | any): string {
    return formatCurrency(value);
  }

}