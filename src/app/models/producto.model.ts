export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  fechaCreacion?: string | Date;
}
