import { Component, Input } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-task-action',
  standalone: true,
  imports: [
    MatIcon, CommonModule, RouterLink
  ],
  templateUrl: './task-action.component.html',
  styleUrl: './task-action.component.scss'
})
export class TaskActionComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() actions!: { name: string, action?: string }[];

  onActionClick(action: { name: string, action?: string }) {
    if (action.name === 'Verify') {
      this.verifyAction();
    } else if (action.action) {
      window.location.href = action.action;
    }
  }

  verifyAction() {
    // Your custom function logic here
    console.log('Verify action clicked');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}