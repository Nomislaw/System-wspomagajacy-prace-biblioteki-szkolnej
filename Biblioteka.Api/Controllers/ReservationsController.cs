using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class ReservationsController : BaseController<Reservation>
{
    public ReservationsController(IBaseService<Reservation> service) : base(service) { }
}