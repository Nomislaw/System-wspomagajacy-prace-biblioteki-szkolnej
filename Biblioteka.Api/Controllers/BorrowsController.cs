using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class BorrowsController : BaseController<Borrow>
{
    public  BorrowsController(IBaseService<Borrow> service) : base(service) { }
}