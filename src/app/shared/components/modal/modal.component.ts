import {Component, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {Button} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['title'] && changes['title'].currentValue) {
          this.title =changes['title'].currentValue;
        }
        if (changes['helperText'] && changes['helperText'].currentValue) {
          this.helperText =changes['helperText'].currentValue;
        }
      }

    hideModal() {
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
}
