using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SchoolClassesController : ControllerBase
{
    private readonly IBaseService<SchoolClass> _service;
    private readonly AppDbContext _context;

    public SchoolClassesController(IBaseService<SchoolClass> service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }
    
    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetAllClasses()
    {
        var classes = await _service.GetAllAsync();
        return Ok(classes);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult<SchoolClass>> UpdateClass(int id, [FromBody] SchoolClass dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Klasa nie istnieje" }
            });

        return Ok(updated);
    }
    
    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> AddClass([FromBody] SchoolClass schoolClass)
    {
        await _service.AddAsync(schoolClass);
        return Ok(schoolClass);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        var schoolClass = await _service.GetByIdAsync(id);
        if (schoolClass == null)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Klasa nie istnieje" }
            });

        bool hasUsers = schoolClass.Users != null && schoolClass.Users.Any();
        if (hasUsers)
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Nie można usunąć klasy, dopóki przypisani są do niej użytkownicy." }
            });

        await _service.DeleteAsync(id);
        return Ok(new { message = "Klasa usunięta." });
    }
}
