using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemaVenta.DAT.Context;
using SistemaVenta.DAT.Repositorios;
using SistemaVenta.DAT.Repositorios.Contratos;
using SistemaVenta.Utility;
using SistemaVenta.BLL.Services;
using SistemaVenta.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SistemaVenta.BLL.Services.Contrato;

namespace SistemaVenta.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencias(this IServiceCollection services, IConfiguration configuration)
        {
            // Conexion del contexto a la base de datos
            services.AddDbContext<TestingAngularContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>)); // Dependecia para los Repositorios Generales
            services.AddScoped<IVentaRepository, VentaRepository>(); // Se agregar el servicio de Ventas

            services.AddAutoMapper(typeof(AutoMapperProfile)); // Se agrego la dependencia del Auto Mapeo de Modelos a ViewModels(DTOs)

            services.AddScoped<IRolService, RolService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<ICategoriaService, CategoriaService>();
            services.AddScoped<IProductoService, ProductoService>();
            services.AddScoped<IVentaService, VentaService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IMenuService, MenuService>();
        }
    }
}
