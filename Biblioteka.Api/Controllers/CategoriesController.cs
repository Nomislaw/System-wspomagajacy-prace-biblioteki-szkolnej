using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class CategoriesController : BaseController<Category>
{
    public  CategoriesController(IBaseService<Category> service) : base(service) { }
}