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
    public class ProductoService : IProductoService
    {
        private readonly IGenericRepository<Producto> _productoRepository;
        private readonly IMapper _mapper;

        public ProductoService(IGenericRepository<Producto> productoRepository, IMapper mapper)
        {
            _productoRepository = productoRepository;
            _mapper = mapper;
        }

        public async Task<List<ProductoDTO>> Lista()
        {
            try
            {
                var queryProducto = await _productoRepository.Consultar();
                var listaProductos = queryProducto.Include(cat => cat.Categoria).ToList();

                return _mapper.Map<List<ProductoDTO>>(listaProductos.ToList());
            }
            catch
            {
                throw;
            }
        }

        public async Task<ProductoDTO> Crear(ProductoDTO modelo)
        {
            try
            {
                var productoCreado = await _productoRepository.Crear(_mapper.Map<Producto>(modelo));

                if (productoCreado.Id == 0)
                {
                    throw new TaskCanceledException("No se pudo crear");
                }

                return _mapper.Map<ProductoDTO>(productoCreado);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(ProductoDTO modelo)
        {
            try
            {
                var productoModelo = _mapper.Map<Producto>(modelo);
                var productoEncontrado = await _productoRepository.Obtener(u => u.Id == productoModelo.Id);

                if (productoEncontrado == null)
                {
                    throw new TaskCanceledException("El producto no existe");
                }

                productoEncontrado.Nombre = productoModelo.Nombre;
                productoEncontrado.CategoriaId = productoModelo.CategoriaId;
                productoEncontrado.CantidadInventario = productoModelo.CantidadInventario;
                productoEncontrado.Precio = productoModelo.Precio;
                productoEncontrado.Activo = productoModelo.Activo;

                bool respuesta = await _productoRepository.Editar(productoEncontrado);

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
                var productoEncontrado = await _productoRepository.Obtener(p => p.Id == Id);

                if (productoEncontrado == null)
                {
                    throw new TaskCanceledException("El producto no existe");
                }

                bool respuesta = await _productoRepository.Eliminar(productoEncontrado);

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
