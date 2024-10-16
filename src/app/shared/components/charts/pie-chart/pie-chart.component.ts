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
  @Input() data!: Record<string, number>;
  @Input() colors:string[] =[];
  @Input() pieChartLegend = true;
  @Input() is3d:boolean =false;
  @Input() legendPosition: 'top' | 'left' | 'bottom' | 'right' = 'right';

  chartType: ChartType = ChartType.PieChart;
  pieChartData: (string | number)[][] = [];
  pieChartOptions: any = {};
  pieChartColumns: string[] = ['Sector', 'Businesses'];

  ngOnInit(): void {
    this.pieChartOptions = {
      width: 300,
      height: 300,
      
      backgroundColor: 'transparent',
      fontName: 'Arial',
      fontSize: 12,
      colors: this.colors,
      legend: {
        position: this.legendPosition,
      },
      chartArea: { width: '100%',},
      is3D: this.is3d, 
    };

    this.transformData();
  }
  transformData(): void {
    this.pieChartData = Object.entries(this.data);
    this.pieChartData.sort((a, b) => (b[1] as number) - (a[1] as number));
  }
}
