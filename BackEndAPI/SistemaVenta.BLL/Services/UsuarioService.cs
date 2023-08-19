using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaVenta.BLL.Methods;
using SistemaVenta.BLL.Services.Contrato;
using SistemaVenta.DAT.Repositorios.Contratos;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public UsuarioService(IGenericRepository<Usuario> usuarioRepository, IMapper mapper, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _mapper = mapper;
            _config = configuration;
        }

        private string GenerarToken(string UsuarioId, string UsuarioCorreo, string RolNombre)
        {
            var key = _config.GetValue<string>("JwtSettings:key");          // Se obtiene la llave de appSettings.json
            var keyBytes = Encoding.ASCII.GetBytes(key);                    // Se convierte a un array

            // Apartir de la informacion del usuario se creará el token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, UsuarioId),
                new Claim(ClaimTypes.Name, UsuarioCorreo),
                new Claim(ClaimTypes.Role, RolNombre)
            };

            var claimIdentity = new ClaimsIdentity(claims);
            /*
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, UsuarioId));
            */

            // Se crea una credencial para el token
            var credencialesToken = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256Signature
                );

            // Se crea el detalle del Token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimIdentity,
                Expires = DateTime.UtcNow.AddMinutes(1),
                SigningCredentials = credencialesToken
            };

            // Se crearan los controladores del JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            string tokenCreado = tokenHandler.WriteToken(tokenConfig);

            return tokenCreado;
        }

        public async Task<List<UsuarioDTO>> Lista()
        {
            try
            {
                var queryUsuario = await _usuarioRepository.Consultar();
                var listaUsuario = queryUsuario.Include(rol => rol.Rol).ToList();

                return _mapper.Map<List<UsuarioDTO>>(listaUsuario);
            }
            catch
            {
                throw;
            }
        }

        public async Task<string> ValidarCredenciales(string correo, string clave)
        {
            try
            {
                string hashedPassword = Encrypt.EncryptPassword(clave);

                var queryUsuario = await _usuarioRepository.Consultar(u =>
                    u.Correo == correo &&
                    u.Clave == hashedPassword
                );

                if (await queryUsuario.FirstOrDefaultAsync() == null)
                {
                    throw new TaskCanceledException("El usuario no existe");
                }
                else
                {
                    Usuario devolverUsuario = queryUsuario.Include(rol => rol.Rol).First();
                    var sesionDTO = _mapper.Map<SesionDTO>(devolverUsuario);
                    string tokenGenerado = GenerarToken(sesionDTO.UsuarioId.ToString(), sesionDTO.UsuarioCorreo, sesionDTO.RolNombre);

                    return tokenGenerado;
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task<UsuarioDTO> Crear(UsuarioDTO modelo)
        {
            try
            {
                string hashedPassword = Encrypt.EncryptPassword(modelo.Clave);
                modelo.Clave = hashedPassword;
                var usuarioCreado = await _usuarioRepository.Crear(_mapper.Map<Usuario>(modelo));

                if (usuarioCreado.Id == 0)
                {
                    throw new TaskCanceledException("No se pudo crear el usuario");
                }

                var query = await _usuarioRepository.Consultar(u => u.Id == usuarioCreado.Id);
                usuarioCreado = query.Include(rol => rol.Rol).First();

                return _mapper.Map<UsuarioDTO>(usuarioCreado);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(UsuarioDTO modelo)
        {
            try
            {
                var usuarioModelo = _mapper.Map<Usuario>(modelo);
                var usuarioEncontrado = await _usuarioRepository.Obtener(u => u.Id == usuarioModelo.Id);

                if (usuarioEncontrado == null)
                {
                    throw new TaskCanceledException("El usuario no existe");
                }

                string hashedPassword = Encrypt.EncryptPassword(usuarioModelo.Clave);
                usuarioEncontrado.Nombre = usuarioModelo.Nombre;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.RolId = usuarioModelo.RolId;
                usuarioEncontrado.Clave = hashedPassword;
                usuarioEncontrado.Activo = usuarioModelo.Activo;

                bool respuesta = await _usuarioRepository.Editar(usuarioEncontrado);

                if (!respuesta)
                {
                    throw new TaskCanceledException("No se pudo editar");
                }

                return respuesta;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int Id)
        {
            try
            {
                var usuarioEncontrado = await _usuarioRepository.Obtener(u => u.Id == Id);

                if (usuarioEncontrado == null)
                {
                    throw new TaskCanceledException("El usuario no existe");
                }

                bool respuesta = await _usuarioRepository.Eliminar(usuarioEncontrado);

                if (!respuesta)
                {
                    throw new TaskCanceledException("No se pudo eliminar");
                }

                return respuesta;
            }
            catch
            {
                throw;
            }
        }
    }
}
