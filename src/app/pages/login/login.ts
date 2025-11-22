import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'] 
})
export class LoginComponent {
  credenciales = { correo: '', password: '' };
  cargando = false;
  errorMsg = '';
  constructor(private auth: AuthService, private router: Router) {}
  ingresar() {
    this.errorMsg = '';

    if (!this.credenciales.correo || !this.credenciales.password) {
      this.errorMsg = 'Completa correo y contraseña.';
      return;
    }
    this.cargando = true;
    this.auth.login(this.credenciales).subscribe({
      next: (res: any) => {
        if (!res?.token) {
          this.errorMsg = 'Respuesta inválida del servidor.';
          this.cargando = false;
          return;
        }
        this.auth.setToken(res.token);

         const rol = this.auth.getRol?.() || this.auth.getUsuarioDesdeToken()?.rol;

        if (rol === 'administrador') {
        this.router.navigate(['/dashboard']);
        } else if (rol === 'logistica') {
        this.router.navigate(['/entregas']);
        } else {
        this.router.navigate(['/pedidos']);
      }
      },
      error: (err) => {
        this.errorMsg = err?.error?.msg || 'Credenciales inválidas.';
        this.cargando = false;
      },
      complete: () => (this.cargando = false)
    });
  }
}