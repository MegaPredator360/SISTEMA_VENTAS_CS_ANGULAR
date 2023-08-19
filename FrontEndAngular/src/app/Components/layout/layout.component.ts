import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';

import { MenuService } from 'src/app/Services/menu.service';
import { UtilityService } from 'src/app/Reutilizable/utility.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = "";
  rolUsuario: string = "";

  constructor(
    private router: Router,
    private _menuService: MenuService,
    private _utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    const usuario = this._utilityService.obtenerSesion();

    if (usuario != null)
    {
      this.rolUsuario = usuario.role;
      this.correoUsuario = usuario.unique_name;
    }
    else
    {
      this.rolUsuario = '';
      this.correoUsuario = '';
    }
  }

  cerrarSesion()
  {
    this._utilityService.eliminarSesionUsuario();
    this.router.navigate(['Login']);
  }
}
