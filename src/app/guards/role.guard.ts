import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = route.data?.['roles'] as string[] | undefined;
  if (!allowed || allowed.length === 0) return true;

  if (auth.hasRole(allowed)) return true;

  alert('No tienes permisos para acceder.');
  router.navigate(['/pedidos']);
  return false;
};