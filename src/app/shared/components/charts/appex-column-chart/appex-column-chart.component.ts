import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";
import { NgApexchartsModule } from 'ng-apexcharts'

@Component({
  selector: 'app-appex-column-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './appex-column-chart.component.html',
  styleUrl: './appex-column-chart.component.scss'
})
export class AppexColumnChartComponent {
  @Input() height: number =350
  @Input() data: {label: string, value: number}[] =[]
  @ViewChild("chart") chart!: ChartComponent;
  chartOptions:any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      this.data =changes["data"].currentValue
      this.updateSeries(this.data);
    }
  }

  ngOnInit(){
    const data =this.data
    this.chartOptions = {
      series: [
        {
          name: "Deals",
          data: data.map(item => item.value)
        }
      ],
      annotations: {
        points: [
          {
            x: "Stages",
            seriesIndex: 0,
            label: {
              borderColor: "#775DD0",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#775DD0"
              },
              text: "Deals Per Stage"
            }
          }
        ]
      },
      chart: {
        height: 300,
        type: "bar",
        toolbar: false
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          endingShape: "rounded",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1
      },

      grid: {
        show: false,
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        tickPlacement: "on",
        categories: data.map(item => item.label),
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };
}

updateSeries(data: {value: number, label:string}[]) {
  if(!this.chartOptions) return;
  this.chartOptions.series =[{
    name: "Deals",
    data: data.map(item => item.value)
  }]
  this.chartOptions.xaxis = {
    labels: {
      rotate: -45
    },
    tickPlacement: "on",
    categories: data.map(item => item.label),
  }
}

}
