import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent {

  @Input() ylabel: string = 'Businesses';
  @Input() xlabel: string = 'Funding Range';

  chartType: ChartType = ChartType.ColumnChart;
  chartData: (string | number)[][] = [];
  options: any = {};

  ngOnInit(): void {
    // Set chart options during initialization
    this.options = {
      bars: 'vertical',
      colors: ['#1b9e77', '#d95f02'],
      hAxis: { title: this.xlabel, gridlines: { count: 0 }, baselineColor: 'none' },
      vAxis: { title: this.ylabel, gridlines: { count: 0 }, baselineColor: 'none'  },
      legend: 'none',
      is3D: true
    };

    // Prepare and transform data for the chart
    this.transformData();
  }

  // Function to transform data for the chart
  transformData(): void {
    // Data for different funding ranges
    this.chartData = [
      ['$0 - $10M', 15],      // 15 businesses require $0 - $10M funding
      ['$10M - $1B', 25],     // 25 businesses require $10M - $1B funding
      ['$1B - $100B', 8],     // 8 businesses require $1B - $100B funding
      ['Unlimited', 3]        // 3 businesses require unlimited funding
    ];

    // No need to sort here, since it's just funding ranges
  }
}
