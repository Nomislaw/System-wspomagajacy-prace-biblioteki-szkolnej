using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Biblioteka.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PublishersController : ControllerBase
{
    private readonly IBaseService<Publisher> _service;

    public PublishersController(IBaseService<Publisher> service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetAllPublishers()
    {
        var publishers = await _service.GetAllAsync();
        return Ok(publishers);
    }

    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult> AddPublisher([FromBody] Publisher publisher)
    {
        await _service.AddAsync(publisher);
        return Ok(publisher);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult<Publisher>> UpdatePublisher(int id, [FromBody] Publisher dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Wydawnictwo nie istnieje" } });

        return Ok(updated);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeletePublisher(int id)
    {
        var publisher = await _service.GetByIdAsync(id);
        if (publisher == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Wydawca nie istnieje" } });

        bool hasBooks = publisher.Books != null && publisher.Books.Any();
        if (hasBooks)
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Nie można usunąć wydawcy, dopóki istnieją książki przypisane do tego wydawcy." } });

        await _service.DeleteAsync(id);
        return Ok(new { message = "Wydawnictwo usunięte." }); 
    }

}