using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class CopiesController : BaseController<Copy>
{
    public  CopiesController(IBaseService<Copy> service) : base(service) { }
}