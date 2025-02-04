import { Component } from '@angular/core';
import { PartnerLayoutComponent } from "../../components/layout/layout.component";
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [PartnerLayoutComponent, TableModule, CommonModule, TimeAgoPipe],
  templateUrl: './investors.component.html',
  styleUrl: './investors.component.scss'
})
export class InvestorsComponent {
  cols = [
    { field: 'name', header: 'User' },
    { field: 'organization', header: 'Organization' },
    { field: 'email', header: 'Email' },
    { field: 'createdAt', header: 'Joined' },
  ];
  users = [
    { name: "Alice Johnson", email: "alice.johnson@example.com", organization: "Tech Innovators Inc.", createdAt: new Date("2024-06-01") },
    { name: "Bob Smith", email: "bob.smith@example.com", organization: "Global Investment Group", createdAt: new Date("2024-06-02") },
    { name: "Charlie Brown", email: "charlie.brown@example.com", organization: "NextGen Solutions", createdAt: new Date("2024-06-03") },
    { name: "Diana White", email: "diana.white@example.com", organization: "Wealth Builders Ltd.", createdAt: new Date("2024-06-04") },
    { name: "Ethan Black", email: "ethan.black@example.com", organization: "Green Energy Startups", createdAt: new Date("2024-06-05") },
    { name: "Fiona Green", email: "fiona.green@example.com", organization: "Venture Capital Partners", createdAt: new Date("2024-06-06") },
    { name: "George Adams", email: "george.adams@example.com", organization: "SmartTech Enterprises", createdAt: new Date("2024-06-07") },
    { name: "Hannah Lee", email: "hannah.lee@example.com", organization: "Elite Investors Network", createdAt: new Date("2024-06-08") },
    { name: "Ian Clark", email: "ian.clark@example.com", organization: "BlueSky Innovations", createdAt: new Date("2024-06-09") },
    { name: "Jessica Wright", email: "jessica.wright@example.com", organization: "Future Growth Fund", createdAt: new Date("2024-06-10") }
];
}
