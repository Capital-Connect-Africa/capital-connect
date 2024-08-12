import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SignalsService } from '../../../core/services/signals/signals.service';
import { AlertTypes } from '../../interfaces/alert.enum';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  alertTypes =AlertTypes;
  @Input() type:AlertTypes =AlertTypes.WARNING;
  @Input() action!:any;
  @Input() actionName:string ='Add';
  @Input() title:string ='Action required';
  @Input() message:string ='Please add your mobile phone number';
  signalsService =inject(SignalsService);

  close(){
    this.signalsService.showInAppAlert.set(false)
  }

}