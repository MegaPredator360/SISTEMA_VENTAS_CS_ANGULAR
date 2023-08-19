using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.Model;

namespace SistemaVenta.DAT.Repositorios.Contratos
{
    public interface IVentaRepository : IGenericRepository<Venta> // Se llama al IGenericRepository<> y se le indica con el modelo que vamos a trabajar
    {
        Task<Venta> Registrar(Venta modelo);
    }
}
