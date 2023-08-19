using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class VentaService : IVentaService
    {
        private readonly IVentaRepository _ventaRepository;
        private readonly IGenericRepository<DetalleVenta> _detalleVentaRepository;
        private readonly IMapper _mapper;

        public VentaService(IVentaRepository ventaRepository, IGenericRepository<DetalleVenta> detalleVentaRepository, IMapper mapper)
        {
            _ventaRepository = ventaRepository;
            _detalleVentaRepository = detalleVentaRepository; 
            _mapper = mapper;
        }

        public async Task<VentaDTO> Registrar(VentaDTO modelo)
        {
            try
            {
                var ventaGenerada = await _ventaRepository.Registrar(_mapper.Map<Venta>(modelo));

                if (ventaGenerada.Id == 0) 
                {
                    throw new TaskCanceledException("No se pudo crear");
                }

                return _mapper.Map<VentaDTO>(ventaGenerada);
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<VentaDTO>> Historial(string buscarPor, string numeroVenta, string fechaInicio, string fechaFinal)
        {
            IQueryable<Venta> query = await _ventaRepository.Consultar();
            var listaResultado = new List<Venta>();

            try
            {
                if (buscarPor == "fecha")
                {
                    DateTime FechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-CR"));
                    DateTime FechaFinal = DateTime.ParseExact(fechaFinal, "dd/MM/yyyy", new CultureInfo("es-CR"));

                    listaResultado = await query
                        .Where(v => v.FechaRegistro.Value.Date >= FechaInicio.Date && v.FechaRegistro.Value.Date <= FechaFinal.Date)
                        .Include(dv => dv.DetalleVenta)
                        .ThenInclude(p => p.Producto)
                        .ToListAsync();
                }
                else
                {
                    listaResultado = await query
                        .Where(v => v.NumeroDocumento == numeroVenta)
                        .Include(dv => dv.DetalleVenta)
                        .ThenInclude(p => p.Producto)
                        .ToListAsync();
                }
            }
            catch
            {
                throw;
            }

            return _mapper.Map<List<VentaDTO>>(listaResultado);
        }

        public async Task<List<ReporteDTO>> Reporte(string fechaInicio, string fechaFinal)
        {
            IQueryable<DetalleVenta> query = await _detalleVentaRepository.Consultar();
            var listaResultado = new List<DetalleVenta>();

            try
            {
                DateTime FechaInicio = DateTime.ParseExact(fechaInicio, "dd/MM/yyyy", new CultureInfo("es-CR"));
                DateTime FechaFinal = DateTime.ParseExact(fechaFinal, "dd/MM/yyyy", new CultureInfo("es-CR"));

                listaResultado = await query
                    .Include(p => p.Producto)
                    .Include(v => v.Venta)
                    .Where(dv => dv.Venta.FechaRegistro.Value.Date >= FechaInicio.Date && dv.Venta.FechaRegistro.Value.Date <= FechaFinal.Date)
                    .ToListAsync();
            }
            catch
            {
                throw;
            }

            return _mapper.Map<List<ReporteDTO>>(listaResultado);
        }
    }
}
