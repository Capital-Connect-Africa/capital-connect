import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleformat',
  standalone: true
})
export class UserRoleFormatPipe implements PipeTransform {

  transform(role: string,): string {
    let userRole =role;
    if(role ==='user') userRole ='business';
    return `${userRole.charAt(0).toUpperCase()}${userRole.slice(1,).toLowerCase()}`
  }

}
