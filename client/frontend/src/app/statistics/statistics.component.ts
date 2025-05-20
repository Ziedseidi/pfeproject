import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  affairesData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  affairesOptions: ChartOptions<'bar'> = {};
  affairesType: ChartType = 'bar';

  avocatsData: ChartData<'pie'> = {
    labels: [],
    datasets: []
  };
  avocatsOptions: ChartOptions<'pie'> = {};
  avocatsType: ChartType = 'pie';  // graphique en cercle

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadDegreJuridiqueChart();
    this.loadAvocatsCountChart();
  }

  loadDegreJuridiqueChart(): void {
    this.statisticsService.getDegreJuridiqueStats().subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data).map(value => Number(value));

      this.affairesData = {
        labels,
        datasets: [{
          label: 'Affaires par degré juridique',
          data: values,
          backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
          borderRadius: 12,
          barPercentage: 0.7,
          categoryPercentage: 0.8
        }]
      };

      this.affairesOptions = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
    });
  }

  loadAvocatsCountChart(): void {
    this.statisticsService.getAvocatsCountByDegreAvecAffaires().subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data).map(value => Number(value));

      this.avocatsData = {
        labels,
        datasets: [{
          label: 'Nombre d\'avocats par degré de juridiction (avec affaires)',
          data: values,
          backgroundColor: ['#f44336', '#3f51b5', '#009688'],
          borderWidth: 1,
          hoverOffset: 20
        }]
      };

      this.avocatsOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      };
    });
  }
}
