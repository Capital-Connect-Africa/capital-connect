import { Component } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [AdminUiContainerComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

}
