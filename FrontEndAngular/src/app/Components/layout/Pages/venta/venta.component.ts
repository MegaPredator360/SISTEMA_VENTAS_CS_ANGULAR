import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent {
  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = []; // Para el autocomplete
  listaProductosParaVenta: DetalleVenta[] = []; // Lista de productos para la venta
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto; // Se utilizará para seleccionar el producto del autocomplete y despues se agregara al DetalleVenta
  tipoDePago: string = "Efectivo";
  totalPagar: number = 0;
  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  // Metodo para el autocomplete
  retornarProductosPorFiltro(busqueda: any): Producto[]
  {
    const valorBuscado = typeof busqueda == "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase(); // Cuando "busqueda" es de tipo String se convierte en un objeto producto, de lo contrario, busca por la propiedad nombre
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor (
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilityService: UtilityService )
  {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this._productoService.Lista().subscribe({
      next: (data) => {
        if (data.status)
        {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.activo == 1 && p.cantidadInventario > 0);
        }
      },
      error: (e) => {}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })
  }

  // Metodo para regresar producto seleccionado en el campo de busqueda
  mostrarProducto(producto: Producto): string
  {
    return producto.nombre
  }

  // Metodo para guardar temporalmente el producto que se ha seleccionado de la lista
  productoParaVenta(event: any)
  {
    this.productoSeleccionado = event.option.value;
  }

  //Metodo para registrar el producto seleccionado de la lista para poder realizar la venta
  agregrarProductoParaVenta()
  {
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    // Lista de productos a vender
    this.listaProductosParaVenta.push({
      productoId: this.productoSeleccionado.id,
      productoNombre: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precio: String(_precio.toFixed(2)),
      total: String(_total.toFixed(2))
    })

    // Agregar lista de productos para vender a la tabla
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    })
  }

  // Metodo para eliminar productos de la lista de vender
  eliminarProducto(detalle: DetalleVenta)
  {
    this.totalPagar = this.totalPagar - parseFloat(detalle.total),
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.productoId != detalle.productoId)
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  // Realizar Venta
  registrarVenta()
  {
    if (this.listaProductosParaVenta.length > 0)
    {
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipoDePago,
        total: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta
      }

      this._ventaService.Registrar(request).subscribe({
        next: (response) => {
          if (response.status)
          {
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Realizada',
              text: `Numero de venta: ${response.value.numeroDocumento}`
            })
          }
          else
          {
            this._utilityService.mostrarAlerta("No se pudo realizar la venta", "Oops")
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },

        error: (e) => {}
      })
    }
  }
}

