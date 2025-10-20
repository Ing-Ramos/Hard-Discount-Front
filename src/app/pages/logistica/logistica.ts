import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './logistica.html',
  styleUrls: ['./logistica.scss']
})
export class LogisticaComponent {
  private http = inject(HttpClient);
  productos: any[] = [];
  pedidos: any[] = [];
  entregas: any[] = [];

  ngOnInit() {
    this.cargarProductos();
    this.cargarPedidos();
    this.cargarEntregas();
  }

  cargarProductos() {
    this.http.get('http://localhost:4000/api/productos').subscribe({
      next: (data: any) => (this.productos = data),
      error: (err) => console.error('Error cargando productos:', err),
    });
  }

  cargarPedidos() {
    this.http.get('http://localhost:4000/api/pedidos').subscribe({
      next: (data: any) => (this.pedidos = data),
      error: (err) => console.error('Error cargando pedidos:', err),
    });
  }

  cargarEntregas() {
    this.http.get('http://localhost:4000/api/entregas').subscribe({
      next: (data: any) => (this.entregas = data),
      error: (err) => console.error('Error cargando entregas:', err),
    });
  }

  actualizarEstado(pedidoId: number, nuevoEstado: string) {
    this.http
      .put(`http://localhost:4000/api/pedidos/${pedidoId}`, { estado: nuevoEstado })
      .subscribe({
        next: () => {
          alert('Estado actualizado ✅');
          this.cargarPedidos();
        },
        error: (err) => console.error(err),
      });
  }

  marcarEntregado(entregaId: number) {
    this.http
      .put(`http://localhost:4000/api/entregas/${entregaId}`, { estado: 'Entregado' })
      .subscribe({
        next: () => {
          alert('Entrega marcada como completada 🚚');
          this.cargarEntregas();
        },
        error: (err) => console.error(err),
      });
  }
}