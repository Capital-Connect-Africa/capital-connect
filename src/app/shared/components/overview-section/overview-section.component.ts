import { Component, Input } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../index";
import {CardComponent} from "../card/card.component";
import {PhotoCollageComponent} from "../../../features/business/components/dashboard/photo-collage/photo-collage.component";

@Component({
  selector: 'app-overview-section',
  standalone: true,
  imports: [CommonModule, SharedModule, CardComponent, PhotoCollageComponent],
  templateUrl: './overview-section.component.html',
  styleUrl: './overview-section.component.scss'
})
export class OverviewSectionComponent {
  @Input() onInvestor: boolean =false;
  @Input() section_title:string ='Overview';
}
