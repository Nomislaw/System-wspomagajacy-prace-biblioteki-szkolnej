using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class UsersController : BaseController<User>
{
    public UsersController(IBaseService<User> service) : base(service) { }
}