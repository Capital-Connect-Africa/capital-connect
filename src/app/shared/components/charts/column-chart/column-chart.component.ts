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

  @Input() ylabel!:string;
  @Input() xlabel!:string;
  @Input() data!:Record<string, number>;
  @Input() colors: string[] =['#1b9e77'];
  chartData: (string | number)[][] = [];
  chartType: ChartType = ChartType.ColumnChart;
  options: any = {};

  ngOnInit(): void {
    this.options = {
      bars: 'vertical',
      colors: this.colors,
      hAxis: { title: this.xlabel, gridlines: { count: 0 }, baselineColor: 'none' },
      vAxis: { title: this.ylabel, gridlines: { count: 0 }, baselineColor: 'none'  },
      legend: 'none',
      is3D: true
    };
    this.transformData();
  }
  transformData(): void {
    if(this.data){
      this.chartData = [...Object.entries(this.data)].map((record: [string, number]) =>{
        return record
      })
    }
  }
}
