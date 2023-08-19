using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class ProductoDTO
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public int? CategoriaId { get; set; }
        public string? CategoriaNombre { get; set; }
        public int? CantidadInventario { get; set; }
        public string? Precio { get; set; }
        public int Activo { get; set; }
    }
}
