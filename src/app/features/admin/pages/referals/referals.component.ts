import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { ReferralsService } from '../../services/referrals.service';
import { AuthStateService } from '../../../auth/services/auth-state.service';

@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [AdminUiContainerComponent, PieChartComponent, CommonModule, TableModule],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss'
})
export class ReferalsComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  private _referralsService =inject(ReferralsService);
  private _authStateService =inject(AuthStateService);
  link ='https://app.capitalconnect.africa/signup?referralId='
  token =this._authStateService.currentUserProfile().referralToken;

  linkCopied =false;
  cols =[
    {header: 'RNK', field: 'rnk'},
    {header: 'User', field: 'user'},
    {header: 'Clicks', field: 'clicks'},
    {header: 'Visits', field: 'visits'},
    {header: 'Conversions', field: 'conversions'},
  ]
  referrals =[
    {
      user: "John Doe",
      referrals: 80,
      conversions: 3,
    },
    {
      user: "Jane Doe",
      referrals: 60,
      conversions: 2,
    },
    {
      user: "Foo Bar",
      referrals: 10,
      conversions: 3,
    },
    {
      user: "Jane Smith",
      referrals: 30,
      conversions: 3,
    },
   
  ]

  referrals$ =new Observable();

  ngOnInit(){
    this.getLeadersBoard();
  }

  async copyToClipboard(): Promise<void> {
    const range = document.createRange();
    const selection = window.getSelection();
  
    if (this.textDiv.nativeElement && selection) {
      range.selectNodeContents(this.textDiv.nativeElement);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        await navigator.clipboard.writeText(`${this.link}${this.token}`)
        this.linkCopied = true;
      } catch (error) {
        this.linkCopied = false;
      }
    }
  }

  getLeadersBoard(page =1, limit =10){
    this.referrals$ =this._referralsService.getLeadersBoard(page, limit)
  }
  
}
