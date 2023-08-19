using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using SistemaVenta.BLL.Services.Contrato;
using SistemaVenta.DTO;
using SistemaVenta.API.Utility;
using SistemaVenta.BLL.Services;

namespace SistemaVenta.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentaController : ControllerBase
    {
        private readonly IVentaService _ventaService;

        public VentaController(IVentaService ventaService)
        {
            _ventaService = ventaService;
        }

        [HttpPost]
        [Route("Registrar")]
        public async Task<IActionResult> Registrar([FromBody] VentaDTO venta)
        {
            var response = new Response<VentaDTO>();

            try
            {
                response.Status = true;
                response.value = await _ventaService.Registrar(venta);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.msg = ex.Message;
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("Historial")]
        public async Task<IActionResult> Historial(string buscarPor, string? numeroVenta, string? fechaInicio, string? fechaFinal)
        {
            var response = new Response<List<VentaDTO>>();
            numeroVenta = numeroVenta is null? "" : numeroVenta;
            fechaInicio = fechaInicio is null? "" : fechaInicio;
            fechaFinal = fechaFinal is null ? "" : fechaFinal;

            try
            {
                response.Status = true;
                response.value = await _ventaService.Historial(buscarPor, numeroVenta, fechaInicio, fechaFinal);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.msg = ex.Message;
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("Reporte")]
        public async Task<IActionResult> Reporte(string? fechaInicio, string? fechaFinal)
        {
            var response = new Response<List<ReporteDTO>>();

            try
            {
                response.Status = true;
                response.value = await _ventaService.Reporte(fechaInicio, fechaFinal);
            }
            catch (Exception ex)
            {
                response.Status = false;
                response.msg = ex.Message;
            }

            return Ok(response);
        }
    }
}
