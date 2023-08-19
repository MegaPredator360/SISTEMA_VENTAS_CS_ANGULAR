import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuardService } from './Services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'Pages/Venta', pathMatch: "full" },
  { path: 'Login', component: LoginComponent, pathMatch: "full" },
  { path: 'Pages', loadChildren: () => import("./Components/layout/layout.module").then(m => m.LayoutModule), canActivate: [AuthGuardService] },
  { path: '*', redirectTo: 'Pages/Venta', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
