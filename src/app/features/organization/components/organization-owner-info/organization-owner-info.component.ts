import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../../users/models';
import { OrganizationInfoContainerComponent } from "../organization-info-container/organization-info-container.component";

@Component({
  selector: 'app-organization-owner-info',
  standalone: true,
  imports: [CommonModule, OrganizationInfoContainerComponent],
  templateUrl: './organization-owner-info.component.html',
  styleUrl: './organization-owner-info.component.scss'
})
export class OrganizationOwnerInfoComponent {

  delete$ = new Observable();

  @Input({required: true}) user!: User

  editUser(){
    // TODO: Implement edit user functionality
  }

  deleteUser(){
    // TODO: Implement delete user functionality
  }

}