import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-horizontal-barchart',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './horizontal-barchart.component.html',
  styleUrl: './horizontal-barchart.component.scss'
})
export class HorizontalBarchartComponent {
  @Input() ylabel:string ='Sector'
  @Input() xlabel: string ='Businesses'
  chartType:ChartType =ChartType.BarChart
  barChartData: (string | number)[][] = [];
  barChartOptions: any = {};

  ngOnInit(): void {
    this.barChartOptions = {
      legend: {position: 'none'},
    };
    this.transformData();
  }
  
  options = {
    bars: 'vertical',
    colors: ['#1b9e77', '#d95f02'],
    hAxis: { title: this.xlabel, gridlines: { count: 0 }, baselineColor: 'none'  },
    vAxis: { title: this.ylabel, gridlines: { count: 0 } },
    legend: 'none',
    is3D: true
  };
  transformData(): void {
    this.barChartData =[
      ['Healthcare', 500],
      ['Technology', 50],
      ['Real Estate', 10],
      ['Financial Services', '30'],
      ['Education', 20],
      ['Food & Agribusiness', 20],
    ]
    this.barChartData.sort((a, b) => (b[1] as number) - (a[1] as number));
    // this.chartData.map(item => [item.country, item.value]);
  }
}
