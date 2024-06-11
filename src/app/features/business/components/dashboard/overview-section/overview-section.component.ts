import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../../../shared";
import {CardComponent} from "../card/card.component";
import {PhotoCollageComponent} from "../photo-collage/photo-collage.component";

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule, SharedModule, CardComponent, PhotoCollageComponent],
  templateUrl: './overview-section.component.html',
  styleUrl: './overview-section.component.scss'
})
export class OverviewSectionComponent {

}
