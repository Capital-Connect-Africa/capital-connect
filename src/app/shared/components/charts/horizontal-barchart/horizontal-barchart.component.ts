import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ChartEvent } from '../../../interfaces/chart.event.interface';

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
  @Input() colors:string[] =['#1b9e77'];
  @Output() onSelect = new EventEmitter<ChartEvent>()
  chartType:ChartType =ChartType.BarChart
  barChartData: (string | number)[][] = [];
  options: Record<string, any> = {};

  ngOnInit(): void {
    this.options = {
      legend: 'none',
      bars: 'horizontal',
      colors: this.colors,
      chartArea: { width: '75%', height: '90%' },
      vAxis: { title: this.ylabel, gridlines: { count: 0 }, textStyle: { fontSize: 10 } },
      hAxis: {  gridlines: { count: 0 }, baselineColor: 'none', textPosition: 'none'  },
    };

    this.transformData();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.transformData();
    }
   
  }
  
  transformData(): void {
    if(this.data){
      this.barChartData =[...Object.entries(this.data)].map((record: [string, number]) =>{
        return record
      })
      this.barChartData.sort((a, b) => (b[1] as number) - (a[1] as number));
    }
  }

  handleSelect(event:any){
    const selection =event.selection.at(0) as {column: number, row: number};
    const selected =this.barChartData[selection?.row?? -1]
    if(selected){
      const [label, value] =selected
      this.onSelect.emit({data: {label: `${label}`, value: Number(value)}})
    }
  }
}
