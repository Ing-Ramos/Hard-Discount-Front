import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  nombre = '';
  correo = '';
  password = '';
  confirmarPassword = '';
  rol = 'cliente'; 
  mensajeError = '';
  mensajeOk = '';

  
  get esAdmin(): boolean {
    return this.authService.getRol() === 'administrador';
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (!this.nombre || !this.correo || !this.password || !this.confirmarPassword) {
      this.mensajeError = 'Completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const payload: any = {
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      password: this.password.trim(),
    };

    
    if (this.esAdmin && this.rol) {
      payload.rol = this.rol;
    }

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.mensajeOk = res?.msg || 'Usuario registrado correctamente.';
      
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        this.mensajeError =
          err.error?.msg || 'Error al registrar usuario. Verifica los datos.';
      },
    });
  }
}