import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.scss'
})
export class UiComponent {
 @Input() title:string | undefined;
}
