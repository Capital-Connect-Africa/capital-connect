import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { GeoSelectEvent } from '../../../interfaces/geo.event.data.interface';

@Component({
  selector: 'app-geo-chart',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent{
  @Input() data: Record<string, number> ={};
  @Input() chartTitle = '';
  @Output() onSelect = new EventEmitter<GeoSelectEvent>()
  chartType:ChartType =ChartType.GeoChart
  geoChartData: (string | number)[][] = [];


  ngOnInit(): void {
    this.transformData();
  }
  options = {
    colors: ['#f6c7b6', '#f3b49f', '#ec8f6e','#e0440e', '#e6693e'],
    fontName: 'Arial',
    fontSize: 12,
    region: '002',
    legend: {
     display: 'none'
    },
  };
  transformData(): void {
    this.geoChartData =[...Object.entries(this.data)].map((record: [string, number]) =>{
      return record
    })
  }

  handleRegionClick(event: any){
    const selection =event.selection.at(0) as {column: number, row: number}
    const selected =this.geoChartData[selection.row || -1]
    if(selected){
      const [country, value] =selected
      this.onSelect.emit({data: {country: `${country}`, value: Number(value)}})
    }
  }
}