import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityService } from '../Reutilizable/utility.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard {

  constructor (private _utilityService: UtilityService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      const usuario = this._utilityService.obtenerSesion();
      const routeRoles = route.data['roles'];
      if (usuario!.role == "Administrador" && routeRoles[0])
      {
        return true;
      }
      else if (usuario!.role == "Supervisor" && routeRoles[1])
      {
        return true;
      }
      else
      {
        this.router.navigate(['/Pages/AccesoDenegado']);
        return false
      }
    }
}
