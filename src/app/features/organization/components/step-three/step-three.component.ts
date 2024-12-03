import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../../shared';
import { OrganizationOnboardService } from '../../services/organization-onboard.service';
import { CompanyResponse } from '../../interfaces';
import { SignalsService } from '../../../../core/services/signals/signals.service';
import { CompanyStateService } from '../../services/company-state.service';
@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent {
  private _companyService =inject(CompanyStateService)
  private _organizationOnboardService = inject(OrganizationOnboardService);
  fileErr ='';
  signals =inject(SignalsService);
  @Input() companyToBeEdited!: CompanyResponse
  logo =this._companyService.currentCompany.companyLogo
  upload$ = new Observable();
  previewUrl!: string | ArrayBuffer | null;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        this.fileErr ='Unsupported file format';
        this.removeLogo();
        return;
      }

      const maxFileSize = 3 * 1024 * 1024; // 3MB in bytes
      if (file.size > maxFileSize) {
        this.fileErr ='File size exceeds 3MB.';
        this.removeLogo();
        return;
      }
      this.fileErr =''
      this._organizationOnboardService.companyLogoToUpload.set(file);
      this._previewFile(file);
    }
  }
  

  private _previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }


  removeLogo(): void {
    this._organizationOnboardService.companyLogoToUpload.set(null as any)
    this.previewUrl = null as any
  }



}
