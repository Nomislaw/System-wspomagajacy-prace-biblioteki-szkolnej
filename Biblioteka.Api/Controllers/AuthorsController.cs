using Biblioteka.Api.Models;
using Biblioteka.Api.Services;

namespace Biblioteka.Api.Controllers;

public class AuthorsController : BaseController<Author>
{
    public  AuthorsController(IBaseService<Author> service) : base(service) { }
}