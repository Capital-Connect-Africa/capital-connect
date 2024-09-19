import { Component, Input, OnInit } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [GoogleChartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input() data!: Record<string, number>; // Input for pie chart data
  @Input() pieChartLegend = true; // Show/hide legend
  @Input() legendPosition: 'top' | 'left' | 'bottom' | 'right' = 'right'; // Legend position

  chartType: ChartType = ChartType.PieChart;
  pieChartData: (string | number)[][] = [];
  pieChartOptions: any = {};
  pieChartColumns: string[] = ['Sector', 'Businesses'];

  ngOnInit(): void {
    // Pie chart options
    this.pieChartOptions = {
      width: 300,
      height: 300,
      
      backgroundColor: 'transparent',
      fontName: 'Arial',
      fontSize: 12,
      legend: {
        position: this.legendPosition,
      },
      chartArea: { width: '100%',},
      is3D: true, 
    };

    this.transformData(); // Transform input data for pie chart
  }

  // Convert input data object to the array format needed by Google Charts
  transformData(): void {
    this.pieChartData = Object.entries(this.data);
    this.pieChartData.sort((a, b) => (b[1] as number) - (a[1] as number)); // Sort by values in descending order
  }
}
