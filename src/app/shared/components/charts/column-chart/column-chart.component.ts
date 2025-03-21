import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ChartEvent } from '../../../interfaces/chart.event.interface';

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
  @Input() height:string ='h-[500px]'
  @Input() data!:Record<string, number>;
  @Input() colors: string[] =['#1b9e77'];
  @Output() onSelect = new EventEmitter<ChartEvent>()
  chartData: (string | number)[][] = [];
  chartType: ChartType = ChartType.ColumnChart;
  options: any = {};
  

  ngOnInit(): void {
    this.initializeChart()
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.transformData();
    }
    if (changes['colors']) {
      this.options['colors'] = this.colors;
    }
  }
  
  transformData(): void {
    if(this.data){
      this.chartData = [...Object.entries(this.data)].map((record: [string, number]) =>{
        return record
      })
    }
  }

  handleSelect(event:any){
    const selection =event.selection.at(0) as {column: number, row: number};
    const selected =this.chartData[selection?.row?? -1]
    if(selected){
      const [label, value] =selected
      this.onSelect.emit({data: {label: `${label}`, value: Number(value)}})
    }
  }

  redrawChart(): void {
    this.transformData();
  }

  initializeChart(){
    this.options = {
      bars: 'vertical',
      colors: this.colors,
      chartArea: { width: '75%', height: '90%' },
      hAxis: { title: this.xlabel, gridlines: { count: 0 }, baselineColor: 'none', textStyle: { fontSize: 10 } },
      vAxis: { textPosition: 'none' , gridlines: { count: 0 }, baselineColor: 'none'  },
      legend: 'none',
      sortColumn: false,
    };
    this.transformData();
  }
}
