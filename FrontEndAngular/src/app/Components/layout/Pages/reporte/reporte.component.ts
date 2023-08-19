import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from "xlsx"

import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

export const MY_DATA_FORMATS =
{
  parse:
  {
    dateInput: 'DD/MM/YYYY'
  },
  display:
  {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [{provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS}]
})

export class ReporteComponent {
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'totalVenta', 'productoNombre', 'cantidad', 'precio', 'total'];
  dataReporteVenta = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilityService: UtilityService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    this.dataReporteVenta.paginator = this.paginacionTabla
  }

  buscarVentas()
  {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFinal = moment(this.formularioFiltro.value.fechaFinal).format('DD/MM/YYYY');

    if (_fechaInicio == "Invalid date" || _fechaFinal == "Invalid date")
    {
      this._utilityService.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
      return;
    }

    this._ventaService.Reporte(_fechaInicio, _fechaFinal).subscribe({
      next: (data) => {
        if (data.status)
        {
          this.listaVentasReporte = data.value;
          this.dataReporteVenta.data = data.value;
        }
        else
        {
          this.listaVentasReporte = [];
          this.dataReporteVenta.data = data.value;
          this._utilityService.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    })
  }

  exportarExcel()
  {
    const wb = XLSX.utils.book_new(); // Se crea el libro
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte); // Se crea la hoja con la lista generada

    XLSX.utils.book_append_sheet(wb, ws, "Reporte"); // Se escribe el nombre de la constante del libro, despues la hoja, y como se va a llamar la hoja
    XLSX.writeFile(wb, "Reporte Ventas.xlsx"); // Se crea el archivo con el nombre del libro y se como se va a llamar el archivo
  }
}
