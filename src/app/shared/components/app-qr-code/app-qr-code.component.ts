import { Component, Input } from '@angular/core';
import { QrCodeComponent } from 'ng-qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [QrCodeComponent],
  templateUrl: './app-qr-code.component.html',
  styleUrl: './app-qr-code.component.scss'
})
export class AppQrCodeComponent {
  @Input() value:string ='';
}
