import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../auth/services/auth-state.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class PublicLayoutComponent {
  logout$ =new Observable()
  private _authStateService =inject(AuthStateService)
  isLoggedIn:boolean =this._authStateService.isLoggedIn;
  partners =[
    {logo: 'assets/img/MEDA.webp', url: 'https://www.meda.org/', name: 'MEDA', height: 'h-6'},
    {logo: 'assets/img/KCIC.png', url: 'https://www.kenyacic.org/', name: 'KCIC', height: 'h-9'},
    {logo: 'assets/img/Raisin.png', url: 'https://raisin.co.ke/', name: 'Raisin', height: 'h-9'},
  ]

  logOut(){
    this.logout$ =this._authStateService.logout(false, false).pipe(tap(() =>{
      this.isLoggedIn =false

    }))
  }
}
