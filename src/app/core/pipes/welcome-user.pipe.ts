import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'welcome_user',
})

export class WelcomeUserPipe implements PipeTransform {
  transform(user:string): string {
    const numberOfHoursSinceMidnight =new Date().getHours()
    return 'good ' +(numberOfHoursSinceMidnight <12? 'morning': numberOfHoursSinceMidnight <16? 'afternoon': 'evening') +  `, ${user}`;
  }
}