import { Component, Input } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  // autoriser plusieurs types (bar, pie, line, doughnut, etc.)
  @Input() type!: ChartType;

  // type générique pour ChartData, en fonction du type de chart
@Input() data!: ChartData<'bar' | 'pie' | 'line' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter'>;

  @Input() options!: ChartOptions;
}
