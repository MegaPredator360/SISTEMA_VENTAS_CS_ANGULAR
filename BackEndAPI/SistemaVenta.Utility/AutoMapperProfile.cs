using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using AutoMapper;
using SistemaVenta.DTO;
using SistemaVenta.Model;

namespace SistemaVenta.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Rol
            CreateMap<Rol, RolDTO>().ReverseMap();
            #endregion Rol

            #region Menu
            CreateMap<Menu, MenuDTO>().ReverseMap();
            #endregion Menu

            #region Usuario
            CreateMap<Usuario, UsuarioDTO>()
                .ForMember(destino => destino.RolNombre, opt => opt.MapFrom(origen => origen.Rol.Nombre))
                .ForMember(destino => destino.Activo, opt => opt.MapFrom(origen => origen.Activo == true ? 1 : 0));

            CreateMap<Usuario, SesionDTO>()
                .ForMember(destino => destino.UsuarioId, opt => opt.MapFrom(origen => origen.Id))
                .ForMember(destino => destino.UsuarioNombre, opt => opt.MapFrom(origen => origen.Nombre))
                .ForMember(destino => destino.UsuarioCorreo, opt => opt.MapFrom(origen => origen.Correo))
                .ForMember(destino => destino.RolNombre, opt => opt.MapFrom(origen => origen.Rol.Nombre));

            CreateMap<UsuarioDTO, Usuario>()
                .ForMember(destino => destino.Rol, opt => opt.Ignore())
                .ForMember(destino => destino.Activo, opt => opt.MapFrom(origen => origen.Activo == 1 ? true : false));
            #endregion Usuario

            #region Categoria
            CreateMap<Categoria, CategoriaDTO>().ReverseMap();
            #endregion Categoria

            #region Producto
            CreateMap<Producto, ProductoDTO>()
                .ForMember(destino => destino.CategoriaNombre, opt => opt.MapFrom(origen => origen.Categoria.Nombre))
                .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Convert.ToString(origen.Precio, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.Activo, opt => opt.MapFrom(origen => origen.Activo == true ? 1 : 0));

            CreateMap<ProductoDTO, Producto>()
                .ForMember(destino => destino.Categoria, opt => opt.Ignore())
                .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Convert.ToDecimal(origen.Precio, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.Activo, opt => opt.MapFrom(origen => origen.Activo == 1 ? true : false));
            #endregion Producto

            #region DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDTO>()
                .ForMember(destino => destino.ProductoNombre, opt => opt.MapFrom(origen => origen.Producto.Nombre))
                .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Convert.ToString(origen.Precio, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.Total, opt => opt.MapFrom(origen => Convert.ToString(origen.Total, new CultureInfo("es-CR"))));

            CreateMap<DetalleVentaDTO, DetalleVenta>()
                .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Convert.ToDecimal(origen.Precio, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.Total, opt => opt.MapFrom(origen => Convert.ToDecimal(origen.Total, new CultureInfo("es-CR"))));
            #endregion DetalleVenta

            #region Venta
            CreateMap<Venta, VentaDTO>()
                .ForMember(destino => destino.Total, opt => opt.MapFrom(origen => Convert.ToString(origen.Total, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.FechaRegistro, opt => opt.MapFrom(origen => origen.FechaRegistro.Value.ToString("dd/MM/yyyy")));

            CreateMap<VentaDTO, Venta>()
                .ForMember(destino => destino.Total, opt => opt.MapFrom(origen => Convert.ToDecimal(origen.Total, new CultureInfo("es-CR"))));
            #endregion Venta

            #region Reporte
            CreateMap<DetalleVenta, ReporteDTO>()
                .ForMember(destino => destino.FechaRegistro, opt => opt.MapFrom(origen => origen.Venta.FechaRegistro.Value.ToString("dd/MM/yyyy")))
                .ForMember(destino => destino.NumeroDocumento, opt => opt.MapFrom(origen => origen.Venta.NumeroDocumento))
                .ForMember(destino => destino.TipoPago, opt => opt.MapFrom(origen => origen.Venta.TipoPago))
                .ForMember(destino => destino.TotalVenta, opt => opt.MapFrom(origen => Convert.ToString(origen.Venta.Total, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.ProductoNombre, opt => opt.MapFrom(origen => origen.Producto.Nombre))
                .ForMember(destino => destino.Precio, opt => opt.MapFrom(origen => Convert.ToString(origen.Precio, new CultureInfo("es-CR"))))
                .ForMember(destino => destino.Total, opt => opt.MapFrom(origen => Convert.ToString(origen.Total, new CultureInfo("es-CR"))));
            #endregion Reporte
        }
    }
}
