import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, Input, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedModule } from "../../../shared";
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { SignalsService } from '../../services/signals/signals.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, AlertComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _authService = inject(AuthStateService);
  private _companyStateService = inject(CompanyStateService);
  private _signalsService =inject(SignalsService);

  businessName = this._companyStateService.currentCompany?.name
  businessLogoUrl = this._companyStateService.currentCompany?.companyLogo?.path ?? 'assets/img/avatar.jpeg';

  logOut$ = new Observable<boolean>();
  phoneNumberPrompt$ =new Observable<any>()

  @Input({ transform: booleanAttribute }) onDashboard: boolean = false;
  @Input() isAdmin = false;

  drawerShowing = false;
  toggleDrawer() {
    this.drawerShowing = !this.drawerShowing;
  }

  logOut() {
    this.logOut$ = this._authService.logout()
  }

  ngOnChanges(): void {
    this._signalsService.showInAppAlert.set(!this._authService.isPhoneNumberAdded());
  }
}
