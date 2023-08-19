using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SistemaVenta.BLL.Services.Contrato;
using SistemaVenta.DAT.Repositorios.Contratos;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.BLL.Services
{
    public class MenuService : IMenuService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepository;
        private readonly IGenericRepository<MenuRol> _menuRolRepository;
        private readonly IGenericRepository<Menu> _menuRepository;
        private readonly IMapper _mapper;

        public MenuService(IGenericRepository<Usuario> usuarioRepository, IGenericRepository<MenuRol> menuRolRepository, IGenericRepository<Menu> menuRepository, IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            _menuRolRepository = menuRolRepository;
            _menuRepository = menuRepository;
            _mapper = mapper;
        }

        public async Task<List<MenuDTO>> Lista(int UsuarioId)
        {
            IQueryable<Usuario> tblUsuario = await _usuarioRepository.Consultar(u => u.Id == UsuarioId);
            IQueryable<MenuRol> tblMenuRol = await _menuRolRepository.Consultar();
            IQueryable<Menu> tblMenu = await _menuRepository.Consultar();

            try
            {
                IQueryable<Menu> tblResultado = (from u in tblUsuario
                                                 join mr in tblMenuRol on u.RolId equals mr.RolId
                                                 join m in tblMenu on mr.MenuId equals m.Id
                                                 select m).AsQueryable();

                var listaMenu = tblResultado.ToList();
                return _mapper.Map<List<MenuDTO>>(listaMenu);
            }
            catch
            {
                throw;
            }
        }
    }
}
