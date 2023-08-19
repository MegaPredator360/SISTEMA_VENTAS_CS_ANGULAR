import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';
import { ResponseAuth } from '../Interfaces/response-auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi: string = environment.endpoint + "Usuario/";

  constructor(private http:HttpClient) { }

  IniciarSesion(request: Login): Observable<ResponseAuth>
  {
    return this.http.post<ResponseAuth>(`${this.urlApi}IniciarSesion`, request)
  }

  Lista(): Observable<ResponseApi>
  {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }

  Guardar(request: Usuario): Observable<ResponseApi>
  {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  Editar(request: Usuario): Observable<ResponseApi>
  {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  Eliminar(Id: number): Observable<ResponseApi>
  {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${Id}`)
  }
}