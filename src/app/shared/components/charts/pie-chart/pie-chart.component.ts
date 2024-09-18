import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'] 
})
export class PieChartComponent {
  @Input() data!: Record<string, number>;
  @Input() pieChartLegend = true;
  @Input() legendPosition: 'top' | 'left' | 'bottom' | 'right' = 'top';

  pieChartPlugins = [];

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        align: 'start',
        display: this.pieChartLegend,
        position: this.legendPosition,
      },
    },
  };

  pieChartLabels: any[] = [];
  pieChartDatasets: any[] = [];

  ngOnInit(): void {
    if (this.data) {
      // Populate labels and datasets
      this.pieChartLabels = [...Object.keys(this.data)];
      this.pieChartDatasets = [{
        data: [...Object.values(this.data)],
        backgroundColor: this.generateColors(Object.keys(this.data).length), // Custom background colors
      }];
    }
  }

  // Generate custom colors for pie chart segments
  generateColors(count: number): string[] {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
}
