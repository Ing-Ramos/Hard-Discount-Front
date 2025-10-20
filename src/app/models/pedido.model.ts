export interface PedidoItem {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
export interface Pedido {
  id?: number;
  usuarioId: number;
  estado?: string;
  fechaPedido?: string;
  productos: PedidoItem[];
}