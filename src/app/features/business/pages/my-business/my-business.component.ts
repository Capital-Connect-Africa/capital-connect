import { Component } from '@angular/core';
import { SidenavComponent } from "../../../../core";
import { MainComponent } from "../../components/my-business/main/main.component";
import { BusinessLinks } from '../../../../core/utils/business.links';

@Component({
  selector: 'app-my-business',
  standalone: true,
  imports: [
    MainComponent,
    SidenavComponent
  ],
  templateUrl: './my-business.component.html',
  styleUrl: './my-business.component.scss'
})
export class MyBusinessComponent {
  links =BusinessLinks
}
