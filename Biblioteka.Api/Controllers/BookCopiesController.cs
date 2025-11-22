using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookCopiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookCopiesController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetCopiesByBookId([FromQuery] int? bookId)
    {
        if (bookId == null)
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Wymagany parametr bookId." }
            });

        var exists = await _context.Books.AnyAsync(b => b.Id == bookId);
        if (!exists)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Książka nie istnieje." }
            });

        var copies = await _context.BookCopies
            .Where(c => c.BookId == bookId)
            .Include(c => c.Book)
            .Select(c => new BookCopyDto
            {
                Id = c.Id,
                BarCode = c.BarCode,
                IsAvailable = c.IsAvailable,
                BookId = c.BookId,
                BookTitle = c.Book.Title
            })
            .ToListAsync();

        return Ok(copies);
    }
    
    [HttpGet("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetById(int id)
    {
        var copy = await _context.BookCopies
            .Include(c => c.Book)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (copy == null)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Egzemplarz nie istnieje." }
            });

        var dto = new BookCopyDto
        {
            Id = copy.Id,
            BarCode = copy.BarCode,
            IsAvailable = copy.IsAvailable,
            BookId = copy.BookId,
            BookTitle = copy.Book.Title
        };

        return Ok(dto);
    }
    
    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> AddBookCopy([FromBody] AddBookCopyDto dto)
    {
        var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
        if (!bookExists)
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Książka o podanym ID nie istnieje." }
            });

        var copy = new BookCopy
        {
            BarCode = dto.BarCode,
            IsAvailable = true,
            BookId = dto.BookId
        };

        try
        {
            _context.BookCopies.Add(copy);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate") == true)
        {
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Egzemplarz z takim kodem kreskowym już istnieje." }
            });
        }

        return Ok(copy);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> UpdateBookCopy(int id, [FromBody] AddBookCopyDto dto)
    {
        var copy = await _context.BookCopies.FindAsync(id);

        if (copy == null)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Egzemplarz nie istnieje." }
            });

        var bookExists = await _context.Books.AnyAsync(b => b.Id == dto.BookId);
        if (!bookExists)
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Książka o podanym ID nie istnieje." }
            });

        copy.BarCode = dto.BarCode;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate") == true)
        {
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Egzemplarz z takim kodem kreskowym już istnieje." }
            });
        }

        return Ok(copy);
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeleteBookCopy(int id)
    {
        var copy = await _context.BookCopies.FindAsync(id);

        if (copy == null)
            return NotFound(new ErrorResponse
            {
                Errors = new List<string> { "Egzemplarz nie istnieje." }
            });

        bool hasBorrows = await _context.Borrows
            .AnyAsync(b => b.BookCopyId == id &&
                           (b.BorrowStatus == BorrowStatus.Active ||
                            b.BorrowStatus == BorrowStatus.Overdue));

        if (hasBorrows)
        {
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Nie można usunąć egzemplarza, ponieważ jest wypożyczony." }
            });
        }

        _context.BookCopies.Remove(copy);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Egzemplarz usunięty." });
    }
}
