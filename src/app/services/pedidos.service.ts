import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  
  private apiUrl = 'http://localhost:4000/api/pedidos';

  constructor(private http: HttpClient) {}

  // Obtener headers con token
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  // Obtener todos los pedidos
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHeaders());
  }

  // Obtener los ítems del pedido
  getPedidoItems(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/items`, this.getHeaders());
  }

  // Crear pedido
  createPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido, this.getHeaders());
  }

  // Actualizar pedido
  updatePedido(id: number, pedido: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pedido, this.getHeaders());
  }

  // Eliminar pedido
  deletePedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // CONFIRMAR PAGO (Yape o Contraentrega)
  confirmarPago(idPedido: number, metodoPago: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${idPedido}/pagar`,
      { metodoPago },        
      this.getHeaders()      
    );
  }

}
