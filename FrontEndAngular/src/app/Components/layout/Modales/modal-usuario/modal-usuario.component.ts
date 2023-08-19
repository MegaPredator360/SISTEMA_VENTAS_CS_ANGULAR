import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})

export class ModalUsuarioComponent {
  formularioUsuario: FormGroup;
  ocultarClave: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor (
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilityService: UtilityService )
  {
    this.formularioUsuario = this.fb.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      clave: ['', Validators.required],
      rolId: ['', Validators.required],
      activo: ['1', Validators.required]
    });

    if (this.datosUsuario != null)
    {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }

    this._rolService.Lista().subscribe({
      next: (data) => {
        if (data.status)
        {
          this.listaRoles = data.value
        }
      },
      error: (e) => {}
    });
  }

  ngOnInit(): void {
    if (this.datosUsuario != null)
    {
      this.formularioUsuario.patchValue({
        cedula: this.datosUsuario.cedula,
        nombre: this.datosUsuario.nombre,
        correo: this.datosUsuario.correo,
        clave: "",
        rolId: this.datosUsuario.rolId,
        activo: this.datosUsuario.activo.toString()
      })
    }
  }

  guardarEditarUsuario()
  {
    const _usuario: Usuario = {
      id: this.datosUsuario == null ? 0 : this.datosUsuario.id,
      cedula: this.formularioUsuario.value.cedula,
      nombre: this.formularioUsuario.value.nombre,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      rolId: this.formularioUsuario.value.rolId,
      rolNombre: "",
      activo: parseInt(this.formularioUsuario.value.activo)
    }

    if (this.datosUsuario == null){
      this._usuarioService.Guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.mostrarAlerta("El usuario fue registrado", "Exito");
            this.modalActual.close("true");
          }
          else {
            this._utilityService.mostrarAlerta("No se pudo registrar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }
    else {
      this._usuarioService.Editar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.mostrarAlerta("El usuario fue actualizado", "Exito");
            this.modalActual.close("true");
          }
          else {
            this._utilityService.mostrarAlerta("No se pudo actualizar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }
  }
}
