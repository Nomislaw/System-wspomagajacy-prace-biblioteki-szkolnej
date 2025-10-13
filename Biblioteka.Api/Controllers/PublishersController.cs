using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class PublishersController : BaseController<Publisher>
{
    public  PublishersController(IBaseService<Publisher> service) : base(service) { }
}