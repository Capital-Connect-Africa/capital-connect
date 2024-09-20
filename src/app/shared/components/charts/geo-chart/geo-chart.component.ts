import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-geo-chart',
  standalone: true,
  imports: [CommonModule, GoogleChartsModule],
  templateUrl: './geo-chart.component.html',
  styleUrls: ['./geo-chart.component.scss']
})
export class GeoChartComponent implements OnInit {
  @Input() chartData: { country: string, value: number }[] = [];
  @Input() chartTitle = 'World Population';
  chartType:ChartType =ChartType.GeoChart
  public geoChartData: (string | number)[][] = [];
  public geoChartOptions: any = {};
  public geoChartColumns: string[] = ['Country', 'Value'];
  public geoChartType: 'GeoChart' = 'GeoChart';

  ngOnInit(): void {
    this.geoChartOptions = {
    colorAxis: { colors: ['#e0f7fa', '#006064'] },
    backgroundColor: '#000000',
    datalessRegionColor: '#000000',
    defaultColor: '#f5f5f5',
    fontName: 'Arial',
    fontSize: 12,
    legend: {
      position: 'bottom',
      alignment: 'center'
    },
    enableRegionInteractivity: true,
    regionClickability: 'enabled',
    width: 800,
    height: 600
  };
    this.transformData();
  }
  options = {
    colors: [ '#ec8f6e', '#f3b49f', '#f6c7b6', '#e0440e', '#e6693e',],
    is3D: true
  };
  transformData(): void {
    this.geoChartData =[
      ['Kenya', 500],
      ['Angola', 50],
      ['Guinea', 10],
      ['Uganda', '30'],
      ['South Africa', 20],
    ]
    // this.chartData.map(item => [item.country, item.value]);
  }
}