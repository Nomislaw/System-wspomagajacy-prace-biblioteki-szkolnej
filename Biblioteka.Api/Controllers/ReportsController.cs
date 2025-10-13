using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
namespace Biblioteka.Api.Controllers;

public class ReportsController : BaseController<Report>
{
    public ReportsController(IBaseService<Report> service) : base(service) { }
}