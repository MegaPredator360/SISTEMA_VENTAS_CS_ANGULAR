import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formularioLogin: FormGroup;
  ocultarClave: boolean = true;
  mostrarLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private _usuarioService: UsuarioService, private _utilityService: UtilityService)
  {
    this.formularioLogin = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  iniciarSesion()
  {
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }

    this._usuarioService.IniciarSesion(request).subscribe({
      next: (data) => {
        if (data.resultado) {
          this._utilityService.guardarSesionUsuario(data.token);
          this.router.navigate(["Pages/Venta"])
        }
        else {
          this._utilityService.mostrarAlerta("No se encontraron coincidencias", "Opps!")
        }
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilityService.mostrarAlerta("Hubo un error", "Opps!")
      }
    })
  }
}
