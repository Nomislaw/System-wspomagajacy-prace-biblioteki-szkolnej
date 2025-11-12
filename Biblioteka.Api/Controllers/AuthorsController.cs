using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Biblioteka.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthorsController : ControllerBase
{
    private readonly IBaseService<Author> _service;

    public AuthorsController(IBaseService<Author> service) 
    {
        _service = service;
    }
    
    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetAllAuthors()
    {
        var users = await _service.GetAllAsync();
        return Ok(users);
    }
    
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult<Author>> UpdateProfile(int id, [FromBody] Author dto)
    {
        var updatedUser = await _service.UpdateAsync(id, dto);
        if (updatedUser == null) return NotFound(new ErrorResponse { Errors = new List<string> { "Użytkownik nie istnieje" } });
        return Ok(updatedUser);
    }
    
    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult> AddAuthor([FromBody] Author author)
    {
        await _service.AddAsync(author);
        return Ok(author);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        var author = await _service.GetByIdAsync(id);
        if (author == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Autor nie istnieje" } });
        
        bool hasBooks = author.Books != null && author.Books.Any(); 
        if (hasBooks)
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Nie można usunąć autora, dopóki istnieją książki przypisane do tego autora." } });

        await _service.DeleteAsync(id);
        return Ok(new { message = "Autor usunięty." }); 
    }

}