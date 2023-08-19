import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { RoleGuard } from 'src/app/Services/role-guard.service';
import { AccesoDenegadoComponent } from './Pages/acceso-denegado/acceso-denegado.component';



const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: 'Dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: {roles: ['Administrador'] } },
    { path: 'Usuario', component: UsuarioComponent, canActivate: [RoleGuard], data: {roles: ['Administrador'] } },
    { path: 'Producto', component: ProductoComponent, canActivate: [RoleGuard], data: {roles: ['Administrador', 'Supervisor'] } },
    { path: 'Venta', component: VentaComponent },
    { path: 'HistorialVenta', component: HistorialVentaComponent },
    { path: 'Reporte', component: ReporteComponent, canActivate: [RoleGuard], data: {roles: ['Administrador', 'Supervisor'] } },
    { path: 'AccesoDenegado', component: AccesoDenegadoComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
