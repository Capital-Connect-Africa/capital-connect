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
  @Input() ylabel!:string;
  @Input() xlabel!: string;
  @Input() data!: Record<string, number>;
  @Input() colors:string[] =['#1b9e77', '#d95f02'];
  chartType:ChartType =ChartType.BarChart
  barChartData: (string | number)[][] = [];
  options: Record<string, any> = {};

  ngOnInit(): void {
    this.options = {
      is3D: true,
      legend: 'none',
      bars: 'horizontal',
      colors: this.colors,
      vAxis: { title: this.ylabel, gridlines: { count: 0 } },
      hAxis: { title: this.xlabel, gridlines: { count: 0 }, baselineColor: 'none'  },
    };

    this.transformData();
  }
  
  
  transformData(): void {
    if(this.data){
      this.barChartData =[...Object.entries(this.data)].map((record: [string, number]) =>{
        return record
      })
      this.barChartData.sort((a, b) => (b[1] as number) - (a[1] as number));
    }
  }
}
