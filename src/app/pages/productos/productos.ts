import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos';
import { Producto } from '../../models/producto.model';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  modalVisible = false;
  editando = false;
  formProducto: Producto = { nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };

  constructor(
    private productosSvc: ProductosService,
    private authService: AuthService
  ) {}
  // Getter: verifica si el usuario es administrador
  get esAdmin(): boolean {
    return this.authService.hasRole('administrador');
  }
  ngOnInit(): void {
    this.cargar();
  }
  // Método de carga adaptado según el rol
  cargar(): void {
    this.productosSvc.getAll().subscribe({
      next: data => {
        // Si es admin, muestra todo; si no, solo los activos
        this.productos = this.esAdmin ? data : data.filter(p => p.activo === true);
      },
      error: err => console.error('Error cargando productos', err)
    });
  }
  abrirModalAgregar(): void {
    this.formProducto = { nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };
    this.editando = false;
    this.modalVisible = true;
  }
  abrirModalEditar(p: Producto): void {
    this.formProducto = { ...p };
    this.editando = true;
    this.modalVisible = true;
  }
  cerrarModal(): void {
    this.modalVisible = false;
  }
  guardar(): void {
    if (this.editando && this.formProducto.id) {
      this.productosSvc.update(this.formProducto.id, this.formProducto).subscribe({
        next: () => {
          alert('Producto actualizado correctamente');
          this.cargar();
          this.cerrarModal();
        },
        error: () => alert('Error al actualizar producto')
      });
    } else {
      this.productosSvc.create(this.formProducto).subscribe({
        next: () => {
          alert('Producto agregado correctamente');
          this.cargar();
          this.cerrarModal();
        },
        error: () => alert('Error al agregar producto')
      });
    }
  }
  eliminar(id?: number): void {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productosSvc.delete(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.cargar();
        },
        error: () => alert('Error al eliminar producto')
      });
    }
  }
}