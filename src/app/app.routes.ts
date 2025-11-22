import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { ProductosComponent } from './pages/productos/productos';
import { PedidosComponent } from './pages/pedidos/pedidos';
import { EntregasComponent } from './pages/entregas/entregas';
import { LogisticaComponent } from './pages/logistica/logistica';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'catalogo', component: CatalogoComponent },

  // Dashboard solo ADMIN
  { 
  path: 'dashboard', 
  component: AdminDashboardComponent, 
  canActivate: [authGuard, roleGuard], 
  data: { roles: ['administrador'] } 
  },
  // Rutas protegidas
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'entregas',
    component: EntregasComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['logistica', 'administrador'] }
  },
  {
    path: 'logistica',
    component: LogisticaComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['logistica', 'administrador'] }
  },

  // Redirecciones
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/dashboard' }
];