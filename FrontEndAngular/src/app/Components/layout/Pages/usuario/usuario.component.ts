import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{
  colunmasTabla: string[] = ['cedula', 'nombre', 'correo', 'rolNombre', 'activo', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor (
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilityService: UtilityService
  ) {}

  obtenerUsuarios()
  {
    this._usuarioService.Lista().subscribe({
      next: (data) => {
        if (data.status)
        {
          this.dataListaUsuarios.data = data.value;
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
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla
  }

  aplicarFiltroTabla(event: Event)
  {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario()
  {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado == 'true')
      {
        this.obtenerUsuarios();
      }
    });
  }

  actualizarUsuario(usuario: Usuario)
  {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true")
      {
        this.obtenerUsuarios();
      }
    });
  }

  eliminarUsuario(usuario: Usuario)
  {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: usuario.nombre,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed)
      {
        this._usuarioService.Eliminar(usuario.id).subscribe({
          next: (data) => {
            if (data.status)
            {
              this._utilityService.mostrarAlerta("El usuario fue eliminado", "Listo!");
              this.obtenerUsuarios();
            }
            else
            {
              this._utilityService.mostrarAlerta("No se pudo eliminar el usuario", "Error")
            }
          },
          error: (e) => {}
        })
      }
    })
  }
}
