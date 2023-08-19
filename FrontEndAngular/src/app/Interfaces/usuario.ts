export interface Usuario {
  id: number,
  cedula: string,
  nombre: string,
  correo: string,
  clave: string,
  rolId: number,
  rolNombre: string,
  activo: number
}
