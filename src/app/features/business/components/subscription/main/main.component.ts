import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../../core/components/navbar/navbar.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
