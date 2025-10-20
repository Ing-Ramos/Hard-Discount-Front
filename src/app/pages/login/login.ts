import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
        this.router.navigateByUrl('/pedidos');
      },
      error: (err) => {
        this.errorMsg = err?.error?.msg || 'Credenciales inválidas.';
        this.cargando = false;
      },
      complete: () => (this.cargando = false)
    });
  }
}