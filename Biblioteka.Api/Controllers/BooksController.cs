using Biblioteka.Api.Models;
using Biblioteka.Api.Services;

namespace Biblioteka.Api.Controllers
{
    public class BooksController : BaseController<Book>
    {
        public BooksController(IBaseService<Book> service) : base(service) { }

   
    }
}