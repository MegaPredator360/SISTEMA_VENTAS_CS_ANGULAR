using System;
using System.Collections.Generic;

namespace SistemaVenta.Model;

public partial class Usuario
{
    public int Id { get; set; }

    public string? Cedula { get; set; }

    public string? Nombre { get; set; }

    public string? Correo { get; set; }

    public string? Clave { get; set; }

    public bool Activo { get; set; }

    public DateTime? FechaContrato { get; set; }

    public int RolId { get; set; }

    public virtual Rol Rol { get; set; } = null!;
}
