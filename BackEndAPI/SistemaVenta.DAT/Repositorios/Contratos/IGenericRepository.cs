using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace SistemaVenta.DAT.Repositorios.Contratos
{
    public interface IGenericRepository<TModel> where TModel : class // Interface para interactuar con todos los modelos
    {
        // Se crean los metodos para usar en la pagina
        Task<TModel> Obtener(Expression<Func<TModel, bool>> filtro); // Metodo para obtener un modelo y una opcion de filtracion
        Task<TModel> Crear(TModel modelo); // Metodo para crear categoria, menú, etc...
        Task<bool> Editar(TModel modelo);
        Task<bool> Eliminar(TModel modelo);
        Task<IQueryable<TModel>> Consultar(Expression<Func<TModel, bool>> filtro = null!);
    }
}
