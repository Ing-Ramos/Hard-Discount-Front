import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { PedidosService } from '../../services/pedidos.service';
import { EntregasService } from '../../services/entregas.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboardComponent implements OnInit {
  totalProductos = 0;
  pedidosCreados = 0;
  pedidosEnProceso = 0;
  pedidosCompletados = 0;
  entregasPendientes = 0;
  entregasCompletadas = 0;

  productosStockBajo: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private pedidosService: PedidosService,
    private entregasService: EntregasService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarPedidos();
    this.cargarEntregas();
  }

  // Productos
  private cargarProductos(): void {
    this.productosService.getAll().subscribe({
      next: (productos: Producto[]) => {
        this.totalProductos = productos.length;
        this.productosStockBajo = productos.filter(p => (p.stock ?? 0) <= 5);
      },
      error: (err: unknown) => console.error('Error al obtener productos:', err),
    });
  }

  // Pedidos
  private cargarPedidos(): void {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos: any[]) => {
        this.pedidosCreados = pedidos.filter(p => p.estado === 'creado').length;
        this.pedidosEnProceso = pedidos.filter(p => p.estado === 'en_proceso' || p.estado === 'procesando').length;
      },
      error: (err) => console.error('Error al obtener pedidos:', err),
    });
  }

  // Entregas
  private cargarEntregas(): void {
    this.entregasService.getEntregas().subscribe({
      next: (entregas: any[]) => {
        this.entregasPendientes = entregas.filter(e => e.estado === 'Pendiente').length;
        this.entregasCompletadas = entregas.filter(e => e.estado === 'Entregado').length;
      },
      error: (err) => console.error('Error al obtener entregas:', err),
    });
  }
}