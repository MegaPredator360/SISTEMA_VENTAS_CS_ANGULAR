import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilityService } from '../Reutilizable/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _utilityService: UtilityService, private router: Router) { }

  canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._utilityService.obtenerSesion()) {
      this.router.navigate(['/Login']);
      return false;
    }
    // logged in, so return true
    this._utilityService.obtenerSesion();
    return true;
  }
}
