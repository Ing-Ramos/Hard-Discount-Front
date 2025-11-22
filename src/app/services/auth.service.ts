import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth'; 
  constructor(private http: HttpClient) {}
  
  login(cred: { correo: string; password: string }) {
    
    return this.http.post<{ token: string; msg?: string }>(`${this.apiUrl}/login`, cred);
  }

  register(data: { nombre: string; correo: string; password: string; rol?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  logout() {
    localStorage.removeItem('token');
  }
  getDecoded(): any | null {
  const token = this.getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
  // Helpers
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getUsuarioDesdeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token); 
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