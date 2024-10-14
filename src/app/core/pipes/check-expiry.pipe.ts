import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'has_expired',
})

export class CheckExpiryPipe implements PipeTransform {
  transform(expiryDate: Date | string | number | any): string {
    const hasExpired =new Date() > new Date(expiryDate)
    return hasExpired ? 'Expired': 'Inactive';
  }
}