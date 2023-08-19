import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{
  colunmasTabla: string[] = ['nombre', 'categoriaNombre', 'cantidadInventario', 'precio', 'activo', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor (
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilityService: UtilityService
  ) {}

  obtenerProductos()
  {
    this._productoService.Lista().subscribe({
      next: (data) => {
        if (data.status)
        {
          this.dataListaProductos.data = data.value;
        }
        else
        {
          this._utilityService.mostrarAlerta("No se encontraton datos", "Oops!")
        }
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla
  }

  aplicarFiltroTabla(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto()
  {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true // Deshabilita la posiblidad de cerrar la ventana si ce hace click fuera de ella
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true")
      {
        this.obtenerProductos();
      }
    });
  }

  actualizarProducto(producto: Producto)
  {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true")
      {
        this.obtenerProductos();
      }
    });
  }

  eliminarProducto(producto: Producto)
  {
    Swal.fire({
      title: '¿Desea eliminar el producto?',
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed)
      {
        this._productoService.Eliminar(producto.id).subscribe({
          next: (data) => {
            if (data.status)
            {
              this._utilityService.mostrarAlerta("El producto fue eliminado", "Listo!");
              this.obtenerProductos();
            }
            else
            {
              this._utilityService.mostrarAlerta("No se pudo eliminar el producto", "Error")
            }
          },
          error: (e) => {}
        })
      }
    })
  }

}
