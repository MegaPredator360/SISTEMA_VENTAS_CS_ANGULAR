using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaVenta.BLL.Methods
{
    public static class Encrypt
    {
        // Metodo para el proceso de encriptacion
        public static string EncryptPassword(string password)
        {
            SHA256 hash = SHA256.Create();
            var passwordBytes = Encoding.Default.GetBytes(password); // Convertira la contraseña en un array de bytes
            var passwordHashed = hash.ComputeHash(passwordBytes);
            return Convert.ToHexString(passwordHashed); // La contraseña sera convertida a string
        }
    }
}
