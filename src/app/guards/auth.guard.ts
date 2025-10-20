import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  // Si no hay token - redirigir al login
  if (!token) {
    alert('⚠️ Debes iniciar sesión para acceder.');
    router.navigate(['/login']);
    return false;
  }
  // Intentar decodificar el token
  const usuario = authService.getUsuarioDesdeToken();
  // Si no se puede decodificar (token da error o expiró)
  if (!usuario) {
    alert('⚠️ Tu sesión ha expirado. Vuelve a iniciar sesión.');
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
  // Si todo está bien permitir acceso
  return true;
};