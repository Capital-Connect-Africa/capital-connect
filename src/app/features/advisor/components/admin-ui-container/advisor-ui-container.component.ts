import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../core';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Link } from '../../../../shared/interfaces/link.interface';
import { UiSharedComponent } from '../../../../shared/components/ui/ui.component';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { SidenavComponent } from "../../../../core/components/sidenav/sidenav.component";


@Component({
  selector: 'app-admin-ui-container',
  standalone: true,
  imports: [CommonModule, UiSharedComponent, NavbarComponent, SidenavComponent],
  templateUrl: './advisor-ui-container.component.html',
  styleUrls: ['./advisor-ui-container.component.scss'] // Use styleUrls instead of styleUrl
})
export class AdvisorUiContainerComponent implements OnInit {
  links: Link[] = [];

  constructor(){}
  signalService = inject(SignalsService);

  @Input() bg_gray: boolean = false;
  @Input({ required: true }) title = 'Dashboard';

  ngOnInit(): void {
    this.signalService.pageTitle.set(this.title);
    this.links = [ 
      { label: 'Sessions', href: '/advisor', exact: false, icon: 'grid_view' ,display:true } ,
      { label: 'Profile', href: '/advisor/profile', exact: false, icon: 'person' ,display:true } 

    ]
  }
}
