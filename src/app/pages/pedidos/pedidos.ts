import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidosService } from '../../services/pedidos.service';
import { AuthService } from '../../services/auth.service';
import { ProductosService } from '../../services/productos.service'; 
import { HttpClient } from '@angular/common/http'; // AGREGAR ESTO
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.scss'
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  // Variables para crear pedido
  nuevoPedido = {
    productos: [{ id: null, cantidad: null, precio: null }]
  };
  pedidoEditando: any = null;
  // Modal
  modalAbierto = false;
  itemsDelPedido: any[] = [];
  pedidoSeleccionado: any = null;
  // Filtros
  filtroUsuario = '';
  filtroFecha = '';
  filtroEstado = '';
  // Estado de carga
  cargandoPedidos = false;

  // Paginacion
  pagina = 1;
  tamPagina = 10;
  
  constructor(
    private pedidosService: PedidosService,
    private authService: AuthService,
    private productosService: ProductosService,
    private http: HttpClient // AGREGAR ESTO
  ) {}
  
  ngOnInit() {
    this.cargarPedidos();
  }
  
  // CARGAR PEDIDOS
  cargarPedidos() {
    this.cargandoPedidos = true;
    this.pedidosService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.pagina = 1;
      },
      error: (err) => console.error('Error al cargar pedidos:', err),
      complete: () => (this.cargandoPedidos = false)
    });
  }
  
  // CREAR PEDIDO
  crearPedido() {
    const usuario = this.authService.getUsuarioDesdeToken();
    if (!usuario) {
      alert('Error: no se encontró usuario autenticado. Inicia sesión nuevamente.');
      return;
    }
    if (this.nuevoPedido.productos.length === 0) {
      alert('Debes agregar al menos un producto.');
      return;
    }
    const pedido = {
      usuarioId: usuario.id,
      productos: this.nuevoPedido.productos
    };
    this.pedidosService.createPedido(pedido).subscribe({
      next: (res: any) => {
        alert(res.msg);
        // Reiniciar los inputs vacíos al crear un pedido
        this.nuevoPedido = { productos: [{ id: null, cantidad: null, precio: null }] };
        this.cargarPedidos();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear pedido');
      }
    });
  }
  
  // Agregar producto sin valores por defecto
  agregarProducto() {
    this.nuevoPedido.productos.push({ id: null, cantidad: null, precio: null });
  }
  
  eliminarProducto(i: number) {
    this.nuevoPedido.productos.splice(i, 1);
  }
  
  // Buscar producto y asignar precio automáticamente
  buscarProductoPorId(index: number) {
    const producto = this.nuevoPedido.productos[index];
    if (!producto.id) return;

    this.productosService.getProductoPorId(producto.id).subscribe({
      next: (res: any) => {
        producto.precio = res.precio;
      },
      error: () => {
        producto.precio = null;
        alert('Producto no encontrado');
      }
    });
  }
  
  // EDITAR PEDIDO - AQUÍ ES DONDE AGREGAMOS LA LÓGICA
  editarPedido(pedido: any) {
    this.pedidoEditando = { ...pedido };
  }
  
  cancelarEdicion() {
    this.pedidoEditando = null;
  }
  
guardarCambios() {
  if (!this.pedidoEditando) return;
  
  const estadoAnterior = this.pedidos.find(p => p.id === this.pedidoEditando.id)?.estado;
  const nuevoEstado = this.pedidoEditando.estado;
  
  const payload = { estado: nuevoEstado };
  
  this.pedidosService.updatePedido(this.pedidoEditando.id, payload).subscribe({
    next: (res: any) => {
    
      if (estadoAnterior === 'creado' && nuevoEstado === 'procesando') {
        this.crearEntregaAutomatica(this.pedidoEditando.id);
        alert('Pedido actualizado a Procesando y entrega creada automáticamente'); 
      } else {
        alert(res.msg); 
      }
      
      this.pedidoEditando = null;
      this.cargarPedidos();
    },
    error: (err) => alert(err?.error?.msg || 'Error al actualizar pedido')
  });
}
 crearEntregaAutomatica(pedidoId: number) {
  this.http.post('http://localhost:4000/api/entregas/desde-pedido', { pedidoId })
    .subscribe({
      next: (response: any) => {
        console.log('Entrega creada:', response);
      },
      error: (err) => {
        console.error('Error:', err);
        if (err.status !== 200 && err.status !== 201) {
          console.warn('Hubo un problema al crear la entrega, pero puede haberse creado');
        }
      }
    });
}
  // ELIMINAR PEDIDO
  eliminarPedido(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;
    this.pedidosService.deletePedido(id).subscribe({
      next: (res: any) => {
        alert(res.msg);
        this.cargarPedidos();
      },
      error: (err) => alert(err?.error?.msg || 'Error al eliminar pedido')
    });
  }
  
  // VER DETALLES (MODAL)
  verDetalle(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.pedidosService.getPedidoItems(pedido.id).subscribe({
      next: (items) => {
        this.itemsDelPedido = items;
        this.modalAbierto = true;
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar los detalles del pedido');
      }
    });
  }
  
  get totalPedido(): number {
    return this.itemsDelPedido.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.itemsDelPedido = [];
    this.pedidoSeleccionado = null;
  }
  
  // FILTROS DE PEDIDOS
  get pedidosFiltrados() {
    return this.pedidos.filter((p) => {
      const porUsuario = this.filtroUsuario
        ? p.usuario.toLowerCase().includes(this.filtroUsuario.toLowerCase())
        : true;
      const porFecha = this.filtroFecha
        ? new Date(p.fechaPedido).toISOString().slice(0, 10) === this.filtroFecha
        : true;
      const porEstado = this.filtroEstado ? p.estado === this.filtroEstado : true;
      return porUsuario && porFecha && porEstado;
    });
  }
  
  // PAGINACON
  get totalPaginas() {
    return Math.max(1, Math.ceil(this.pedidosFiltrados.length / this.tamPagina));
  }
  
  get paginaActual() {
    return Math.min(this.pagina, this.totalPaginas);
  }
  
  get pedidosPaginados() {
    const start = (this.paginaActual - 1) * this.tamPagina;
    return this.pedidosFiltrados.slice(start, start + this.tamPagina);
  }
  
  // ROLES (para mostrar según permisos)
  get esAdmin() {
    return this.authService.hasRole('administrador');
  }
  
  get esLogistica() {
    return this.authService.hasRole('logistica');
  }
  
  get esCliente() {
    return this.authService.hasRole('cliente');
  }
  
  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Pedidos', 14, 16);
    const rows = this.pedidosFiltrados.map(p => ([
      p.id,
      p.usuario,
      p.estado,
      new Date(p.fechaPedido).toLocaleString()
    ]));
    autoTable(doc, {
      startY: 22,
      head: [['ID', 'Usuario', 'Estado', 'Fecha']],
      body: rows
    });
    doc.save('pedidos.pdf');
  }
}