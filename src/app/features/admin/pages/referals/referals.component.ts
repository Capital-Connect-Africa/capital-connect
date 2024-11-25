import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";

@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [AdminUiContainerComponent],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss'
})
export class ReferalsComponent {

}
