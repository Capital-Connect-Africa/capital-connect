import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, inject, Input, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharedModule } from "../../../shared";
import { AuthStateService } from '../../../features/auth/services/auth-state.service';
import { CompanyStateService } from '../../../features/organization/services/company-state.service';
import { SignalsService } from '../../services/signals/signals.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule, AlertComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _fb =inject(FormBuilder)
  signalsService =inject(SignalsService);
  private _authStateService = inject(AuthStateService);
  private _companyStateService = inject(CompanyStateService);

  businessName = this._companyStateService.currentCompany?.name
  businessLogoUrl = this._companyStateService.currentCompany?.companyLogo?.path ?? 'assets/img/avatar.jpeg';

  logOut$ = new Observable<boolean>();
  savephoneNumber$ =new Observable<any>();
  phoneNumberPull$ =new Observable<any>();

  @Input({ transform: booleanAttribute }) onDashboard: boolean = false;
  @Input() isAdmin = false;

  phoneUpdateForm =this._fb.group({
    phone: ['', [
      Validators.required,
    ]]
  })

  drawerShowing = false;
  toggleDrawer() {
    this.drawerShowing = !this.drawerShowing;
  }

  logOut() {
    this.logOut$ = this._authStateService.logout()
  }

  showDialog(){
    this.signalsService.showDialog.set(true)
    
  }

  savePhoneNumber(){
    const phone =(this.phoneUpdateForm.value?.phone)??'';
    this.savephoneNumber$ =this._authStateService.saveUserPhoneNumberAddedStatus(phone).pipe(tap(res =>{
      debugger
      return res
    }))
  }

  ngOnChanges(): void {
    this.phoneNumberPull$ =this._authStateService.isPhoneNumberAdded().pipe(tap(res =>{

    }))
    
    this.signalsService.showInAppAlert.set(true);
  }
}
