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
public class BooksController : ControllerBase
{
    private readonly IBaseService<Book> _service;
    private readonly AppDbContext _context;

    public BooksController(AppDbContext context, IBaseService<Book> service)
    {
        _service = service;
        _context = context;
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookById(int id)
    {
        var book = await _context.Books
            .Include(b => b.Author)
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
            return NotFound();

        var result = new
        {
            book.Id,
            book.Title,
            book.PublicationYear,
            book.ISBN,
            book.Quantity,
            AuthorId = book.AuthorId,
            AuthorName = book.Author.FirstName + " " + book.Author.LastName,
            CategoryId = book.CategoryId,
            CategoryName = book.Category.Name,
            PublisherId = book.PublisherId,
            PublisherName = book.Publisher.Name
        };

        return Ok(result);
    }


    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await _context.Books
            .Include(b => b.Author)
            .Include(b => b.Category)
            .Include(b => b.Publisher)
            .Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                ISBN = b.ISBN,
                PublicationYear = b.PublicationYear,
                Quantity = b.Quantity,
                AuthorName = b.Author.FirstName + " " + b.Author.LastName,
                CategoryName = b.Category.Name,
                PublisherName = b.Publisher.Name
            })
            .ToListAsync();

        return Ok(books);
    }

    [HttpPost]
    [Authorize(Roles = "Librarian")]
    public async Task<ActionResult> AddBook([FromBody] AddBookDto dto)
    {
        try
        {
            var book = new Book
            {
                Title = dto.Title,
                PublicationYear = dto.PublicationYear,
                ISBN = dto.ISBN,
                Quantity = dto.Quantity,
                AuthorId = dto.AuthorId,
                PublisherId = dto.PublisherId,
                CategoryId = dto.CategoryId
            };

            await _service.AddAsync(book);
            return Ok(book);
        }
        catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("Duplicate entry") == true)
        {
            return BadRequest(new ErrorResponse
            {
                Errors = new List<string> { "Książka o takim ISBN już istnieje." }
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] AddBookDto dto)
    {
        var existing = await _service.GetByIdAsync(id);
        if (existing == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Książka nie istnieje" } });
        
        var authorExists = await _context.Authors.AnyAsync(a => a.Id == dto.AuthorId);
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        var publisherExists = await _context.Publishers.AnyAsync(p => p.Id == dto.PublisherId);

        if (!authorExists || !categoryExists || !publisherExists)
        {
            var errors = new List<string>();
            if (!authorExists) errors.Add("Autor nie istnieje.");
            if (!categoryExists) errors.Add("Kategoria nie istnieje.");
            if (!publisherExists) errors.Add("Wydawnictwo nie istnieje.");
            return BadRequest(new ErrorResponse { Errors = errors });
        }

        existing.Title = dto.Title;
        existing.PublicationYear = dto.PublicationYear;
        existing.ISBN = dto.ISBN;
        existing.Quantity = dto.Quantity;
        existing.AuthorId = dto.AuthorId;
        existing.PublisherId = dto.PublisherId;
        existing.CategoryId = dto.CategoryId;

        await _service.UpdateAsync(existing);
        return Ok(existing);
    }

    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _service.GetByIdAsync(id);
        if (book == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Książka nie istnieje" } });

        try
        {
            await _service.DeleteAsync(id);
            return Ok(new { message = "Książka usunięta." }); 
        }
        catch (DbUpdateException)
        {
            return BadRequest(new ErrorResponse 
            { 
                Errors = new List<string> { "Nie można usunąć książki, ponieważ jest powiązana z innymi danymi." } 
            });
        }
    }
}