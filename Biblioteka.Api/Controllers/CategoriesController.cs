using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Biblioteka.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly IBaseService<Category> _service;

    public CategoriesController(IBaseService<Category> service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _service.GetAllAsync();
        return Ok(categories);
    }

    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult> AddCategory([FromBody] Category category)
    {
        await _service.AddAsync(category);
        return Ok(category);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult<Category>> UpdateCategory(int id, [FromBody] Category dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Kategoria nie istnieje" } });

        return Ok(updated);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _service.GetByIdAsync(id);
        if (category == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Kategoria nie istnieje" } });
        
        bool hasBooks = category.Books != null && category.Books.Any();
        if (hasBooks)
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Nie można usunąć kategorii, dopóki istnieją książki przypisane do tej kategorii." } });

        await _service.DeleteAsync(id);
        return Ok(new { message = "Kategoria usunięta." }); 
    }

}