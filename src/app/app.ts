import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  mostrarNavbar = true; 
 constructor(public auth: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        // Rutas donde NO queremos ver el navbar
        const rutasSinNavbar = ['/login', '/registro'];

        this.mostrarNavbar = !rutasSinNavbar.some(r => url.startsWith(r));
      });
  }
  // Saber si el usuario tiene rol de cliente
  get esCliente(): boolean {
    return this.auth.hasRole('cliente');
  }
   // Admin o Logística (estos sí verán el header)
  get esAdminOLogistica(): boolean {
    return this.auth.hasRole(['administrador', 'logistica']);
  }
  get esAdmin(): boolean {
  return this.auth.hasRole(['administrador']);
}
  // Cerrar sesión
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }
}