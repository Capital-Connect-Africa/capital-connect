// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { ChartConfiguration } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';

// @Component({
//   selector: 'app-bubble-chart',
//   standalone: true,
//   imports: [BaseChartDirective, CommonModule],
//   templateUrl: './bubble-chart.component.html',
//   styleUrl: './bubble-chart.component.scss'
// })
// export class BubbleChartComponent {
//   bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
//     responsive: false,
//     scales: {
//       x: {
//         min: 0,
//         max: 30,
//       },
//       y: {
//         min: 0,
//         max: 30,
//       }
//     }
//   };

//   transformData(data: { label: string, population: number }[]): { x: number, y: number, r: number }[] {
//     return data.map((item, index) => ({
//       x: index * 10, // Example transformation
//       y: item.population / 1000000000, // Scale population
//       r: Math.sqrt(item.population) / 5000 // Adjust radius
//     }));
//   }

//   public bubbleChartLegend = true;

//   public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'] = [
//     {
//       data: [
//         { x: 10, y: 10, r: 10 },
//         { x: 15, y: 5, r: 15 },
//         { x: 26, y: 12, r: 23 },
//         { x: 7, y: 8, r: 8 },
//       ],
//       label: 'Businesses Per country',
//     },
//   ];

// }


import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bubble-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss'],
})
export class BubbleChartComponent implements OnInit {
  @Input() chartData: { label: string; value: number }[] = [];
  @Input() chartLabel = 'Data Chart';
  @Input() minX = 0;
  @Input() maxX = 100;
  @Input() minY = 0;
  @Input() maxY = 100;

  bubbleChartOptions: ChartConfiguration<'bubble'>['options'] = {
    responsive: true,
    scales: {
      x: {
        min: this.minX,
        max: this.maxX,
      },
      y: {
        min: this.minY,
        max: this.maxY,
      }
    }
  };

  public bubbleChartDatasets: ChartConfiguration<'bubble'>['data']['datasets'] = [];

  ngOnInit(): void {
    this.bubbleChartDatasets = [
      {
        data: this.transformData(this.chartData),
        label: this.chartLabel,
        backgroundColor: this.generateColors(this.chartData.length),
        borderColor: this.generateColors(this.chartData.length, true),
        hoverBackgroundColor: this.generateColors(this.chartData.length).map(c => c.replace('0.5', '0.8')),
      }
    ];
  }

  transformData(data: { label: string; value: number }[]): { x: number; y: number; r: number; }[] {
    debugger
    return data.map((item, index) => ({
      x: index * 10,
      y: item.value, 
      r: item.value
    }));
  }

  // Method to generate colors for bubbles
  generateColors(length: number, border: boolean = false): string[] {
    const baseColors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)'
    ];
    return Array.from({ length }, (_, i) => border ? baseColors[i % baseColors.length].replace('0.5', '1') : baseColors[i % baseColors.length]);
  }
}
