import { Component, inject } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { SharedModule } from '../../../../shared';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUiContainerComponent } from "../admin-ui-container/admin-ui-container.component";


@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    SharedModule, CommonModule, ButtonModule,
    AdminUiContainerComponent 
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private _router = inject(Router);

  navigateTo(path: string) {
    this._router.navigate([path]);
  }


}
