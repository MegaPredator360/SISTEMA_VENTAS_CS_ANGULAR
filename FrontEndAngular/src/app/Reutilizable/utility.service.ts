import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseAuth } from '../Interfaces/response-auth';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  user!: Sesion;

  constructor(private _snackBar: MatSnackBar) {
   }

  mostrarAlerta(mensaje: string, tipo: string)
  {
    this._snackBar.open(mensaje, tipo,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
  }

  guardarSesionUsuario(token: string)
  {
    localStorage.setItem("token", JSON.stringify(token))
  }

  obtenerSesion()
  {
    const dataCadena = localStorage.getItem("token");
    if (dataCadena != null)
    {
      return JSON.parse(atob(dataCadena!.split('.')[1])) as Sesion;
    }
    else
    {
      return null;
    }

  }

  eliminarSesionUsuario()
  {
    localStorage.removeItem("token")
  }
}
