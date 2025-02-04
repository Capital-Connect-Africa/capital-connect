import { Component, inject } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { AuthStateService } from '../../../auth/services/auth-state.service';
import { WelcomeUserPipe } from "../../../../core/pipes/welcome-user.pipe";
import { CommonModule } from '@angular/common';
import { ReferralLinkComponent } from "../../../../shared/components/referral-link/referral-link.component";
import { TableModule } from 'primeng/table';
import { UserRoleFormatPipe } from "../../../../core/pipes/user-role-format.pipe";
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { HorizontalBarchartComponent } from "../../../../shared/components/charts/horizontal-barchart/horizontal-barchart.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PartnerLayoutComponent, WelcomeUserPipe, ReferralLinkComponent, TableModule, UserRoleFormatPipe, TimeAgoPipe, HorizontalBarchartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _authStateService =inject(AuthStateService)
  firstName =this._authStateService.currentUserProfile().firstName
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Type' },
    { field: 'createdAt', header: 'Joined' },
  ];

  voucherCols = [
    { field: 'code', header: 'Code' },
    { field: 'discount', header: 'Discount' },
    { field: 'maxUses', header: 'Max Uses' },
    { field: 'maxAmount', header: 'Max Amount' },
    { field: 'uses', header: 'Uses' },
    { field: 'createdAt', header: 'Created' },
    { field: 'expiresAt', header: 'Expires' },
  ];

  users = [
    { name: "Alice Johnson", email: "alice.johnson@example.com", role: "business", createdAt: new Date("2024-06-01T10:30:00Z") },
    { name: "Bob Smith", email: "bob.smith@example.com", role: "investor", createdAt: new Date("2024-06-02T12:15:00Z") },
    { name: "Charlie Brown", email: "charlie.brown@example.com", role: "business", createdAt: new Date("2024-06-03T14:45:00Z") },
    { name: "Diana White", email: "diana.white@example.com", role: "investor", createdAt: new Date("2024-06-04T09:20:00Z") },
  ];
  
  businessData = {
    "Technology": 120,
    "Finance": 85,
    "Healthcare": 60,
    "Retail": 95,
    "Education": 40,
    "Real Estate": 50,
    "Manufacturing": 70,
    "Hospitality": 55,
    "Agriculture": 30,
    "Energy": 45
  };
  
  
  
  vouchers = [
    {
      id: 1,
      code: "A1B2C3D4",
      maxUses: 100,
      uses: 10,
      maxAmount: 500,
      percentageDiscount: 15,
      createdAt: new Date("2024-07-01T10:00:00Z"),
      expires: new Date("2024-12-31T23:59:59Z")
    },
    {
      id: 2,
      code: "E5F6G7H8",
      maxUses: 50,
      uses: 5,
      maxAmount: 300,
      percentageDiscount: 10,
      createdAt: new Date("2024-07-05T12:30:00Z"),
      expires: new Date("2024-11-30T23:59:59Z")
    },
    {
      id: 3,
      code: "I9J0K1L2",
      maxUses: 200,
      uses: 50,
      maxAmount: 1000,
      percentageDiscount: 20,
      createdAt: new Date("2024-07-10T14:45:00Z"),
      expires: new Date("2025-01-31T23:59:59Z")
    },
    {
      id: 4,
      code: "M3N4O5P6",
      maxUses: 75,
      uses: 20,
      maxAmount: 400,
      percentageDiscount: 12,
      createdAt: new Date("2024-07-15T16:20:00Z"),
      expires: new Date("2024-10-31T23:59:59Z")
    },
    {
      id: 5,
      code: "Q7R8S9T0",
      maxUses: 150,
      uses: 30,
      maxAmount: 750,
      percentageDiscount: 18,
      createdAt: new Date("2024-07-20T18:10:00Z"),
      expires: new Date("2025-02-28T23:59:59Z")
    }
  ];
  
}
