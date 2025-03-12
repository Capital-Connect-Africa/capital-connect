import { Component, inject } from '@angular/core';
import { WelcomeTemplateComponent } from "../../../../shared/components/welcome-template/welcome-template.component";
import { SignUpFormComponent } from "../../components/sign-up-form/sign-up-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ROLES } from '../../../../shared';

@Component({
  selector: 'app-special-signup',
  standalone: true,
  imports: [WelcomeTemplateComponent, SignUpFormComponent],
  templateUrl: './special-signup.component.html',
  styleUrl: './special-signup.component.scss'
})
export class SpecialSignupComponent {
  private _activatedRoute =inject(ActivatedRoute)
  private _router =inject(Router);
  specialRole =this._activatedRoute.snapshot.params['special-role'];
  ngOnInit(){
    if(![USER_ROLES.PARTNER, USER_ROLES.ADVISOR, USER_ROLES.STAFF].includes(this.specialRole)){
      this._router.navigateByUrl('/')
    }
  }
}
