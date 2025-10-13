using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class ReviewsController : BaseController<Review>
{
    public ReviewsController(IBaseService<Review> service) : base(service) { }
}