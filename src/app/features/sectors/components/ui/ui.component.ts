import { CommonModule } from '@angular/common';
import {Component, inject, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.scss'
})
export class UiComponent {
 @Input() title:string | undefined;
 @Input() showLogo = true

 private _router = inject(Router);

 goToHome() {
  this._router.navigateByUrl('/')
 }


}
