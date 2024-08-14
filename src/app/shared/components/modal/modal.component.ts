import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
    @Input() visible =false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() title!:string;
    @Input() helperText!:string;
    @Input() value!:number;

    hideModal() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
}
