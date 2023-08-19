import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/Services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";

  constructor(
    private _dashboardService: DashboardService
    ) {}

  mostrarGraficos(labelGrafico: any[], dataGrafico: any[])
  {
    //Se creara una etiqueta en HTML donde se usara esa constante, y dentro de la etiqueta se mostrará el grafico
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# Ventas',
          data: dataGrafico,
          backgroundColor:['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {beginAtZero: true}
        }
      }
    });
  }

  ngOnInit(): void{
    this._dashboardService.Resumen().subscribe({
      next: (data) => {
        if (data.status)
        {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[] = data.value.ventasUltimaSemana;
          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          this.mostrarGraficos(labelTemp, dataTemp);
        }
      },
      error: (e) => {}
    })
  }
}
