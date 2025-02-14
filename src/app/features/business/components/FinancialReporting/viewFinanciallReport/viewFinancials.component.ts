import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationService } from 'ngx-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { SharedModule } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { FinancialInfoRecords } from '../../../../questions/interfaces';
import { Input,SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-view-financial-reporting',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    TabViewModule, SharedModule, FormsModule, MultiSelectModule,ReactiveFormsModule
  ],
  templateUrl: './viewFinancials.component.html',
  styleUrl: './viewFinancials.component.scss',
  providers: [PaginationService]
})
export class ViewFinancialReporting {
  @Input() financialInfoRecords!: FinancialInfoRecords[];

  ngOnInit() {
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['financialInfoRecords'] && changes['financialInfoRecords'].currentValue) {
      this.transformData()
    }
  }

  // financialInfoRecords: FinancialInfoRecords[] = [];

  opexData: any[] = [];
  revenueData: any[] = [];
  costOfSalesData:any[] = []
  combinedData:any[] = []
  reversedTableData: any[] = [];
  years: number[] = [];


  transformData() {
    this.years = Array.from(
      new Set(this.financialInfoRecords.map((item) => item.year))
    ).sort((a, b) => a - b); // Sort numerically in ascending order
  
    // Prepare rows with descriptions and values
    const opexRows: any = {};
    const revenueRows: any = {};
    const costOfSalesRows: any = {};
    const costOfSalesTotals: any = {};
    const revenueTotals: any = {};
    const opexTotals: any = {};
  
    // Additional rows
    const taxesRow: any = { description: 'Taxes', section: 'Operating Expenses' };
    const ebitRow: any = { description: 'EBIT', section: 'Operating Expenses' };
    const amortisationRow: any = { description: 'Depreciation and Amortisation', section: 'Operating Expenses' };
    const interestsRow: any = { description: 'Interests', section: 'Operating Expenses' };
    const profitBeforeTax: any = { description: 'Profit before Tax', section: 'Operating Expenses' };
    const grossProfit: any ={description: 'Gross Profit', section: '' };
    const netProfit: any = { description: 'Net Profit', section: 'Operating Expenses' };
    const ebitdaRow: any = { description: 'EBITDA', section: 'Operating Expenses' };
    const grossMargin: any = {description:'Gross Margin', section:'Operating Expenses'};
    const ebitdaMargin : any =  {description:'EBITDA Margin', section:'Operating Expenses'};
  
    this.financialInfoRecords.forEach((entry) => {
      const year = entry.year;
  
      // Handle revenues
      entry.revenues.forEach((rev: any) => {
        if (!revenueRows[rev.description]) {
          revenueRows[rev.description] = { description: rev.description, section: 'Revenues' };
        }
        revenueRows[rev.description][year] = rev.value;
  
        // Add to revenue totals
        revenueTotals[year] = (revenueTotals[year] || 0) + rev.value;
      });
  
      // Handle cost of sales
      entry.costOfSales.forEach((cos: any) => {
        if (!costOfSalesRows[cos.description]) {
          costOfSalesRows[cos.description] = { description: cos.description, section: 'Cost of Sales' };
        }
        costOfSalesRows[cos.description][year] = cos.value;
  
        // Add to cost of sales totals
        costOfSalesTotals[year] = (costOfSalesTotals[year] || 0) + cos.value;
      });
  
      // Handle opex
      entry.opex.forEach((opex: any) => {
        if (!opexRows[opex.description]) {
          opexRows[opex.description] = { description: opex.description, section: 'Operating Expenses' };
        }
        opexRows[opex.description][year] = opex.value;
        opexTotals[year] = (opexTotals[year] || 0) + opex.value;
      });
  
      // Additional rows
      ebitdaRow[year] = entry.ebitda;
      amortisationRow[year] = entry.amorDep;
      ebitRow[year] = entry.ebit;
      interestsRow[year] = entry.interests;
      profitBeforeTax[year] = entry.profitBeforeTax;
      taxesRow[year] = entry.taxes;
      netProfit[year] = entry.netProfit;
      grossProfit[year] = entry.grossProfit,
      grossMargin[year] = entry.grossMargin == null ? '-'  : entry.grossMargin ,
      ebitdaMargin[year] = entry.ebitdaMargin == null ? '-' : entry.ebitdaMargin 
    });
  
    // Add total rows
    revenueRows['Total Revenue'] = { description: 'Total Revenue', section: 'Revenues', ...revenueTotals };
    costOfSalesRows['Total Cost of Sales'] = { description: 'Total Cost of Sales', section: 'Cost of Sales', ...costOfSalesTotals };
    opexRows['Total Operating Expenses'] = { description: 'Total Operating Expenses', section: 'Operating Expenses', ...opexTotals };
  
    // Combine all rows into a single array
    this.combinedData = [
      ...Object.values(revenueRows),
      ...Object.values(costOfSalesRows),
      grossProfit,
      ...Object.values(opexRows),
      grossMargin,
      ebitdaRow,
      ebitdaMargin,
      amortisationRow,
      ebitRow,
      interestsRow,
      profitBeforeTax,
      taxesRow,
      netProfit,    
   
    ];
  }

}
