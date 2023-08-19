import { DetalleVenta } from "./detalle-venta"

export interface Venta {
  id?: number,
  numeroDocumento?: string,
  tipoPago: string,
  total: string,
  fechaRegistro?: string,
  detalleVenta: DetalleVenta[]
}
