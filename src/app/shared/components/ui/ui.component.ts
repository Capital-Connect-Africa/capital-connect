import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ui-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './ui.component.html',
  styleUrl: './ui.component.scss'
})
export class UiSharedComponent {

  private _router = inject(Router);

  @Input() showLogo = true

  goToHome() {
    this._router.navigateByUrl('/')
  }



}
