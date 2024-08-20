import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.scss'
})
export class AlertCardComponent {
  @Input() heading!:string;
  @Input() body!:string;
  @Input() link!:string;
  @Input() command!:string;
  @Input() className!:string;
}
