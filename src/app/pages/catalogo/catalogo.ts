import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  constructor(private productosSvc: ProductosService) {}
  ngOnInit(): void {
    this.productosSvc.getAll().subscribe({
      next: (data) => {
        this.productos = data.filter(p => p.activo === true); 
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.cargando = false;
      }
    });
  }
}