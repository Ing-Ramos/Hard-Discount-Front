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
    // Detectar cambios de ruta para ocultar el navbar en /login o /register
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarNavbar = !(
          event.url.includes('/login') ||
          event.url.includes('/register')
        );
      });
  }
  // Saber si el usuario tiene rol de cliente
  get esCliente(): boolean {
    return this.auth.hasRole('cliente');
  }
  // Cerrar sesión
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }
}