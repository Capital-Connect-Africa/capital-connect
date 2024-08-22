import { Component, HostListener, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Observable, tap } from "rxjs";
import { ProBadgeComponent } from "../pro-badge/pro-badge.component";
import { SharedModule } from "../../../shared";
import { NavbarToggleService } from "../../services/navbar-toggle/navbar.toggle.service";
import { AuthStateService } from '../../../features/auth/services/auth-state.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ProBadgeComponent, SharedModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})

export class SidenavComponent {
  @Input() links!: { label: string, href: string, exact: boolean, icon?: string }[];
  private toggleService = inject(NavbarToggleService);
  private _authStateService =inject(AuthStateService)
  logOut$ = new Observable<boolean>();

  logOut() {
    this.logOut$ = this._authStateService.logout()
  }


  ngOnInit() {
    if (window.innerWidth > 991) {
      this.toggleService.showNavBar();
    }
    else if (window.innerWidth > 767) {
      this.toggleService.showNavBar();
      this.showNav = false;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    if (window.innerWidth > 767) {
      this.toggleService.showNavBar()
    }
  }

  sideNavIsHidden$ = this.toggleService.navBarIsHidden$.pipe(tap(state => {
    this.isHidden = state;
  }));

  isHidden: boolean | undefined;
  showNav = true;

  toggle_navbar() {
    this.showNav = !this.showNav;
  }


  hide_navbar() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 767) {
      //In desktop we do not remove the sidebar from the screen
      this.showNav = !this.showNav;
    }
    else {
      this.toggleService.toggleVisibility();
    }
  }
}
