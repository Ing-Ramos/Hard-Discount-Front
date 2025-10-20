import { Routes } from '@angular/router';
import { ProductosComponent } from './pages/productos/productos';
import { PedidosComponent } from './pages/pedidos/pedidos';
import { EntregasComponent } from './pages/entregas/entregas';
import { LoginComponent } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { LogisticaComponent } from './pages/logistica/logistica'; 

export const routes: Routes = [
  // Ruta pública
  { path: 'login', component: LoginComponent },
  { path: 'catalogo', component: CatalogoComponent },
  // Rutas protegidas por autenticación
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
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
  { path: '**', redirectTo: '/pedidos' }
];