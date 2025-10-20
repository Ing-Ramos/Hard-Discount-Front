import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth'; 
  constructor(private http: HttpClient) {}
  // ---- HTTP ----
  login(cred: { correo: string; password: string }) {
    // backend debe responder { token: '...' } o { msg, token }
    return this.http.post<{ token: string; msg?: string }>(`${this.apiUrl}/login`, cred);
  }
  // ---- Token storage ----
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  logout() {
    localStorage.removeItem('token');
  }
  // ---- Helpers ----
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUsuarioDesdeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token); // debe contener al menos { id, nombre, rol, ...}
    } catch (err) {
      console.error('Error al decodificar token:', err);
      return null;
    }
  }
  // Helpers de rol 
getRol(): string | null {
  const u = this.getUsuarioDesdeToken();
  return u?.rol ?? null;
}
hasRole(roles: string[] | string): boolean {
  const rol = this.getRol();
  if (!rol) return false;
  return Array.isArray(roles) ? roles.includes(rol) : rol === roles;
}
}