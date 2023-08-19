using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SistemaVenta.DAT.Context;
using SistemaVenta.DAT.Repositorios.Contratos;
using SistemaVenta.Model;

namespace SistemaVenta.DAT.Repositorios
{
    public class VentaRepository : GenericRepository<Venta>, IVentaRepository // Se llama al Repositorio General, se especifica al modelo, y se llama a la interface del modelo
    {
        private readonly TestingAngularContext _context;

        public VentaRepository(TestingAngularContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Venta> Registrar(Venta modelo) // Metodo para Registrar Venta
        {
            Venta ventaGenerada = new Venta();

            using (var transaction = _context.Database.BeginTransaction()) // Creamos una transaccion en donde si ocurre un error en alguna de las tablas, se realiza un Rollback 
            {
                try
                {
                    foreach(DetalleVenta dv in modelo.DetalleVenta) // Por cada lista que hay en Detalle Venta
                    {
                        Producto productoEncontrado = _context.Productos.Where(p => p.Id == dv.ProductoId).First(); // Se busca el producto

                        productoEncontrado.CantidadInventario = productoEncontrado.CantidadInventario - dv.Cantidad; // Se resta la cantidad de producto en el inventario
                        _context.Productos.Update(productoEncontrado); // Se guardan los cambios
                    }
                    await _context.SaveChangesAsync();

                    NumeroDocumento correlativo = _context.NumeroDocumentos.First(); // Se llama al numero del documento
                    correlativo.UltimoNumero = correlativo.UltimoNumero + 1; // Se le suma un numero al UltimoNumero para indicar que ese numero va a ser el siguiente en ser facturado
                    correlativo.FechaRegistro = DateTime.Now; // Se le indica la fecha en donde se realizó ese cambio
                    _context.NumeroDocumentos.Update(correlativo);
                    await _context.SaveChangesAsync();

                    int CantidadDigitos = 4; // Cantidad de Ceros que tendrá el número de factura
                    string ceros = string.Concat(Enumerable.Repeat("0", CantidadDigitos)); // Concatenará Ceros a la cantidad de digitos que hemos establecido
                    string numeroVenta = ceros + correlativo.UltimoNumero.ToString(); // Se creará el número de venta basado en el UltimoNumero
                    numeroVenta = numeroVenta.Substring(numeroVenta.Length - CantidadDigitos, CantidadDigitos); // Borrará los ceros que queden de más para que sea igual a la cantidad de digitos que queremos en nuestro numero de factura

                    modelo.NumeroDocumento = numeroVenta;   // Le asignamos el numero de factura al NumeroDocumento basado en la operacion que hicimos con el numeroVenta
                    await _context.Venta.AddAsync(modelo);
                    await _context.SaveChangesAsync();

                    ventaGenerada = modelo;

                    transaction.Commit();
                }
                catch // Si ocurre algún error durante ese procedimientento, no va a guardar ningun cambio y hará un Rollback
                {
                    transaction.Rollback();
                    throw;
                }

                return ventaGenerada;
            }
        }
    }
}
