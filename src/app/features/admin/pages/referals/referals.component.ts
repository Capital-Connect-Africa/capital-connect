import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminUiContainerComponent } from "../../components/admin-ui-container/admin-ui-container.component";
import { PieChartComponent } from "../../../../shared/components/charts/pie-chart/pie-chart.component";
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago.pipe";
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-referals',
  standalone: true,
  imports: [AdminUiContainerComponent, PieChartComponent, CommonModule, TableModule],
  templateUrl: './referals.component.html',
  styleUrl: './referals.component.scss'
})
export class ReferalsComponent {
  @ViewChild('textDiv') textDiv!: ElementRef<HTMLDivElement>;
  linkCopied =false;
  cols =[
    {header: 'RNK', field: 'rnk'},
    {header: 'User', field: 'user'},
    {header: 'Referrals', field: 'referrer'},
    {header: 'Conversions', field: 'referrer'},
    {header: 'Conversion Rate', field: 'joined'},
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

  async copyToClipboard(): Promise<void> {
    const range = document.createRange();
    const selection = window.getSelection();
  
    if (this.textDiv.nativeElement && selection) {
      range.selectNodeContents(this.textDiv.nativeElement);
      selection.removeAllRanges();
      selection.addRange(range);
      const textToCopy = this.textDiv.nativeElement.textContent || '';
      try {
        await navigator.clipboard.writeText(textToCopy)
        this.linkCopied = true;
      } catch (error) {
        this.linkCopied = false;
      }
    }
  }
  
}
