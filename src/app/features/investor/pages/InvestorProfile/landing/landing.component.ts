import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import { LayoutComponent } from '../../../../../shared/business/layout/layout.component';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LayoutComponent,
    RouterModule
],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  private _router =inject(Router);

  goToProfile(): void {
    this._router.navigate(['/investor/investor-details']);
  }

}
