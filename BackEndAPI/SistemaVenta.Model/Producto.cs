using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Producto
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public int CantidadInventario { get; set; }

    public decimal Precio { get; set; }

    public bool Activo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public int CategoriaId { get; set; }

    public virtual Categoria Categoria { get; set; } = null!;

    public virtual ICollection<DetalleVenta> DetalleVenta { get; set; } = new List<DetalleVenta>();
}
