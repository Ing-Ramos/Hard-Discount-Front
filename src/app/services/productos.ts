import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  // URL del backend (asegurar que el backend esté corriendo en este puerto)
  private apiUrl = 'http://localhost:4000/api/productos';
  constructor(private http: HttpClient) {}
  // Obtener todos los productos
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  // Obtener un producto por ID
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
  // Crear nuevo producto
  create(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }
  // Actualizar un producto existente
  update(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }
  // Eliminar un producto
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getProductoPorId(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}
}