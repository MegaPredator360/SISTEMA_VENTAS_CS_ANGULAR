using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.DTO
{
    public class AuthResponse
    {
        public string? Token { get; set; }
        public bool Resultado { get; set; }
        public string? msg { get; set; }
    }
}
