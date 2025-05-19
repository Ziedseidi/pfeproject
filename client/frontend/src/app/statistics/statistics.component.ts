import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent {
  // Bar chart "Affaires"
  affairesData: ChartData<'bar'> = {
    labels: ['Gagnées', 'Perdues'],
    datasets: [{
      label: 'Affaires',
      data: [20, 10],
      backgroundColor: ['#4caf50', '#f44336'],
      borderRadius: 12,
      barPercentage: 0.7,
      categoryPercentage: 0.8
    }]
  };
  affairesOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Statistiques des affaires',
        font: { size: 18, weight: 'bold' },
        color: '#222'
      },
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#555', font: { size: 14 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
        ticks: { color: '#555', font: { size: 14 } }
      }
    }
  };
  affairesType: ChartType = 'bar';

  // Pie chart "Types" avec effet 3D simulé
  typesData: ChartData<'pie'> = {
    labels: ['Type A', 'Type B', 'Type C'],
    datasets: [{
      label: 'Types d’affaires',
      data: [15, 25, 10],
      backgroundColor: [
        'rgba(33, 150, 243, 0.85)', // bleu
        'rgba(255, 152, 0, 0.85)',  // orange
        'rgba(156, 39, 176, 0.85)'  // violet
      ],
      borderColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 6,
      hoverOffset: 40,
      hoverBorderColor: 'rgba(0,0,0,0.2)'
    }]
  };
  typesOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 14, weight: 'bold' }, color: '#333' } },
      title: {
        display: true,
        text: 'Répartition des types d’affaires',
        font: { size: 18, weight: 'bold' },
        color: '#222'
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#222',
        titleFont: { size: 16 },
        bodyFont: { size: 14 }
      }
    }
  };
  typesType: ChartType = 'pie';

  // Bar chart "Tribunaux"
tribunauxData: ChartData<'doughnut'> = {
  labels: ['Tribunal A', 'Tribunal B'],
  datasets: [{
    label: 'Affaires traitées',
    data: [45, 32],
    backgroundColor: ['#36A2EB', '#FF6384'],
    borderColor: '#fff',
    borderWidth: 2,
    hoverOffset: 30
  }]
};

tribunauxOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Tribunaux ayant le plus de charges d’affaires',
      font: { size: 18, weight: 'bold' },
      color: '#222'
    },
    legend: { 
      display: true,
      position: 'bottom',
      labels: { font: { size: 14 }, color: '#555' }
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#222',
      titleFont: { size: 16 },
      bodyFont: { size: 14 }
    }
  }
};

// et ton type
tribunauxType: ChartType = 'polarArea';
}
