import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  @Input() type: ChartType = 'bar';
  @Input() data: ChartData = { labels: [], datasets: [] };
  @Input() options: ChartOptions = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] || changes['data']) {
      this.applyDefaultOptions();
    }
  }

  private applyDefaultOptions(): void {
    const baseOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#64748B',
            font: {
              family: "'Inter', sans-serif",
              size: 12
            },
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          boxPadding: 6
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawTicks: false
          },
          ticks: {
            color: '#64748B'
          }
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawTicks: false
          },
          ticks: {
            color: '#64748B'
          }
        }
      }
    };

    // Fusionner les options personnalisées avec les options par défaut
    this.options = {
      ...baseOptions,
      ...this.options
    };
  }
}