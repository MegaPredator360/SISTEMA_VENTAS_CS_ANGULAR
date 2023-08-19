using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class SesionDTO
    {
        public int UsuarioId { get; set; }
        public string? UsuarioNombre { get; set; }
        public string? UsuarioCorreo { get; set; }
        public string? RolNombre { get; set; }
    }
}
