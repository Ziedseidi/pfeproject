import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { StatisticsService } from 'src/app/services/statistics.service';

interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    borderRadius?: number;
  }[];
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  affairesData: ChartData = { labels: [], datasets: [] };
  affairesOptions: ChartConfiguration['options'] = {};

  avocatsData: ChartData = { labels: [], datasets: [] };
  avocatsOptions: ChartConfiguration['options'] = {};

 clientsData: ChartData = { labels: [], datasets: [] };
  clientsOptions: ChartConfiguration['options'] = {};

  contratsData: ChartData = { labels: [], datasets: [] };
  contratsOptions: ChartConfiguration['options'] = {};

  consignationSaisieData: ChartData = { labels: [], datasets: [] };
  consignationSaisieOptions: ChartConfiguration['options'] = {};

  statutAffairesData: ChartData = { labels: [], datasets: [] };
  statutAffairesOptions: ChartConfiguration['options'] = {};

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadAllCharts();
  }

  loadAllCharts(): void {
    this.loadBarChart();
    this.loadPieChart();
    this.loadClientsChart();
    this.loadDoughnutChart();
    this.loadGroupedBarChart();
    this.loadAffairesStatutChart(); // 👈 Ajout ici
  }

  private loadBarChart(): void {
    this.statisticsService.getDegreJuridiqueStats().subscribe({
      next: (data: any) => {
        this.affairesData = {
          labels: Object.keys(data),
          datasets: [{
            label: 'Affaires',
            data: Object.values(data),
            backgroundColor: 'rgba(66, 58, 231, 0.7)',
            borderColor: 'rgba(66, 58, 231, 1)',
            borderWidth: 1,
            borderRadius: 6
          }]
        };

        this.affairesOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: this.getCommonPlugins()
        };
      },
      error: (err: any) => console.error('Error loading bar chart:', err)
    });
  }

  private loadPieChart(): void {
    this.statisticsService.getAvocatsCountByDegreAvecAffaires().subscribe({
      next: (data: any) => {
        this.avocatsData = {
          labels: Object.keys(data),
          datasets: [{
            data: Object.values(data),
            backgroundColor: [
              'rgba(66, 58, 231, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(231, 76, 60, 0.7)'
            ],
            borderWidth: 1
          }]
        };

        this.avocatsOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...this.getCommonPlugins(),
            legend: { position: 'right' }
          }
        };
      },
      error: (err: any) => console.error('Error loading pie chart:', err)
    });
  }

private loadClientsChart(): void {
  this.statisticsService.getAffairesCountByTypeClient().subscribe({
    next: (data: any) => {
      // data est un objet, pas un tableau
      const labels = Object.keys(data);
      const values = Object.values(data).map(v => Number(v));

      this.clientsData = {
        labels: labels,
        datasets: [{
          label: 'Affaires',
          data: values,
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 205, 86, 0.7)'
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 205, 86, 1)'
          ],
          borderWidth: 1
        }]
      };

      this.clientsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        },
        plugins: this.getCommonPlugins()
      };
    },
    error: (err: any) => console.error('Error loading clients chart:', err)
  });
}



  private loadDoughnutChart(): void {
    this.statisticsService.getContratsCountByEtat().subscribe({
      next: (data: any) => {
        this.contratsData = {
          labels: ['Acceptés', 'Refusés'],
          datasets: [{
            data: [data.accepté, data.refusé],
            backgroundColor: [
              'rgba(16, 185, 129, 0.7)',
              'rgba(231, 76, 60, 0.7)'
            ],
            borderWidth: 1
          }]
        };

        this.contratsOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...this.getCommonPlugins(),
            legend: { position: 'right' }
          }
        };
      },
      error: (err: any) => console.error('Error loading doughnut chart:', err)
    });
  }

  private loadGroupedBarChart(): void {
    this.statisticsService.getConsignationAndSaisieStats().subscribe({
      next: (data: any) => {
        this.consignationSaisieData = {
          labels: ['Payées', 'Non payées'],
          datasets: [
            {
              label: 'Consignation',
              data: [data.consignation.paid, data.consignation.unpaid],
              backgroundColor: 'rgba(66, 58, 231, 0.7)',
              borderColor: 'rgba(66, 58, 231, 1)',
              borderWidth: 1
            },
            {
              label: 'Saisie',
              data: [data.saisie.paid, data.saisie.unpaid],
              backgroundColor: 'rgba(245, 158, 11, 0.7)',
              borderColor: 'rgba(245, 158, 11, 1)',
              borderWidth: 1
            }
          ]
        };

        this.consignationSaisieOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: false, grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: this.getCommonPlugins()
        };
      },
      error: (err: any) => console.error('Error loading grouped bar chart:', err)
    });
  }

  private loadAffairesStatutChart(): void {
    this.statisticsService.getAffairesStatusCount().subscribe({
      next: (data: any) => {
        this.statutAffairesData = {
          labels: ['En cours', 'Terminées'],
          datasets: [{
            label: 'Affaires',
            data: [data.enCours, data.terminees],
            backgroundColor: [
              'rgba(255, 205, 86, 0.7)',
              'rgba(16, 185, 129, 0.7)'
            ],
            borderColor: [
              'rgba(255, 205, 86, 1)',
              'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 1,
            borderRadius: 6
          }]
        };

        this.statutAffairesOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
          },
          plugins: this.getCommonPlugins()
        };
      },
      error: (err: any) => console.error('Error loading statut affaires chart:', err)
    });
  }

  private getCommonPlugins(): any {
    return {
      tooltip: {
        backgroundColor: 'rgba(30, 30, 30, 0.95)',
        titleFont: { family: 'Poppins', size: 14, weight: 'bold' },
        bodyFont: { family: 'Poppins', size: 12 },
        padding: 10,
        cornerRadius: 5
      }
    };
  }
}
