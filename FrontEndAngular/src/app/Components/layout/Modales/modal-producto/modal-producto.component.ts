import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent {
  formularioProducto: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCategorias: Categoria[] = [];

  constructor (
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaService: CategoriaService,
    private _productoService: ProductoService,
    private _utilityService: UtilityService
  ) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      categoriaId: ['', Validators.required],
      cantidadInventario: ['', Validators.required],
      precio: ['', Validators.required],
      activo: ['1', Validators.required]
    })

    if (this.datosProducto != null)
    {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._categoriaService.Lista().subscribe({
      next: (data) => {
        if (data.status)
        {
          this.listaCategorias = data.value
        }
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null)
    {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        categoriaId: this.datosProducto.categoriaId,
        cantidadInventario: this.datosProducto.cantidadInventario,
        precio: this.datosProducto.precio,
        activo: this.datosProducto.activo.toString()
      })
    }
  }

  guardarEditarProducto()
  {
    const _producto: Producto = {
      id: this.datosProducto == null ? 0 : this.datosProducto.id,
      nombre: this.formularioProducto.value.nombre,
      categoriaId: this.formularioProducto.value.categoriaId,
      categoriaNombre: "",
      cantidadInventario: this.formularioProducto.value.cantidadInventario,
      precio: this.formularioProducto.value.precio,
      activo: parseInt(this.formularioProducto.value.activo)
    }

    // Si los datos del producto son nulos, cargará la interface de Guardar, si no, cargará el de Editar
    if (this.datosProducto == null){
      this._productoService.Guardar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.mostrarAlerta("El producto fue registrado", "Exito");
            this.modalActual.close("true");
          }
          else {
            this._utilityService.mostrarAlerta("No se pudo registrar el producto", "Error")
          }
        },
        error: (e) => {}
      })
    }
    else {
      this._productoService.Editar(_producto).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.mostrarAlerta("El producto fue actualizado", "Exito");
            this.modalActual.close("true");
          }
          else {
            this._utilityService.mostrarAlerta("No se pudo actualizar el producto", "Error")
          }
        },
        error: (e) => {}
      })
    }
  }
}
