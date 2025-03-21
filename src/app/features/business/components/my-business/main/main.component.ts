import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {NavbarComponent} from "../../../../../core";
import {TaskActionComponent} from "../../../../../shared/components/task-action/task-action.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatIcon,
    NavbarComponent,
    TaskActionComponent,
    RouterModule,
    MatTabsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  verificationForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.verificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      country: ['', Validators.required],
      language: ['', Validators.required],
      redirect_url: ['', Validators.required],
      allow_warnings: [5, Validators.required],
      ttl: [60, Validators.required],
      verification_mode: ['any', Validators.required],
      document: this.fb.group({
        proof: ['', Validators.required],
        additional_proof: [''],
        supported_types: [['id_card', 'driving_license', 'passport']],
        name: ['', Validators.required],
        dob: ['', Validators.required],
        age: ['', Validators.required],
        issue_date: ['', Validators.required],
        expiry_date: ['', Validators.required],
        document_number: ['', Validators.required],
        allow_offline: ['1', Validators.required],
        allow_online: ['1', Validators.required],
        gender: ['', Validators.required]
      })
    });
  }

  submitForm() {
    if (this.verificationForm.valid) {
      this.http.post('https://your-backend-api.com/verify', this.verificationForm.value)
        .subscribe(response => {
          console.log('Verification submitted:', response);
        }, error => {
          console.error('Error submitting verification:', error);
        });
    }
  }

  task_one =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Verify', action: ''},

  ]
  task_two =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: ''},
    {name: 'Verify', action: ''},

  ]
  task_three =[
    {name: 'Get Expert Document Prep', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Verify', action: ''},

  ]
  task_four =[
    {name: 'Get Expert Document Prep', action:'mailto: services@capitalconnect.africa'},
    {name: 'Validate', action: 'mailto: services@capitalconnect.africa'},
    {name: 'Verify', action: ''},

  ]
}
