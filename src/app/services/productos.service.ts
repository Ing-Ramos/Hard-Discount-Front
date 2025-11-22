import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:4000/api/productos';
  constructor(private http: HttpClient) {}
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
  create(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }
  update(id: number, producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getProductoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  getTotalProductos(): Observable<number> {
    return new Observable<number>((observer) => {
      this.getAll().subscribe({
        next: (productos) => {
          observer.next(productos.length);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
  getProductosConStockBajo(limite: number = 10): Observable<Producto[]> {
    return new Observable<Producto[]>((observer) => {
      this.getAll().subscribe({
        next: (productos) => {
          const filtrados = productos.filter((p) => p.stock <= limite);
          observer.next(filtrados);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}