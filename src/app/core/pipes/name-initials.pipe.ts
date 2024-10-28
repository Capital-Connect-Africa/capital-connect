import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'get_name_initials',
  standalone: true
})
export class NameInitialsPipe implements PipeTransform {

  transform(name: string): string {
    const parts =name.split(' ');
    const initials =(parts.length >1? `${parts.at(0)?.charAt(0)}${parts.at(-1)?.charAt(0)}`: parts.at(0)?.charAt(0)) as string
    return initials.toUpperCase();
  }

}