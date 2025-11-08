using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BorrowsController(AppDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> GetBorrows()
        {
            var borrows = await _context.Borrows
                .Include(b => b.Book)
                .Include(b => b.User)
                .Select(b => new BorrowDto
                {
                    Id = b.Id,
                    BookTitle = b.Book.Title,
                    UserName = b.User.FirstName + " " + b.User.LastName,
                    BorrowDate = b.BorrowDate,
                    TerminDate = b.TerminDate,
                    ReturnDate = b.ReturnDate,
                    BorrowStatus = b.BorrowStatus
                })
                .ToListAsync();

            return Ok(borrows);
        }
        
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> UpdateBorrowStatus(int id, [FromBody] BorrowStatus newStatus)
        {
            var borrow = await _context.Borrows.FindAsync(id);
            if (borrow == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono wypożyczenia." } });

            if (borrow.BorrowStatus == newStatus)
                return BadRequest(new ErrorResponse { Errors = new List<string> { "Wypożyczenie już ma ten status." } });

            borrow.BorrowStatus = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Status wypożyczenia został zmieniony na {newStatus}." });
        }
        
        [HttpPut("update-overdue")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> MarkOverdueBorrows()
        {
            var now = DateTime.Now;
            
            var overdue = await _context.Borrows
                .Where(b => b.BorrowStatus == BorrowStatus.Active && b.TerminDate < now && b.ReturnDate == null)
                .ToListAsync();

            foreach (var b in overdue)
                b.BorrowStatus = BorrowStatus.Overdue;

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Zaktualizowano {overdue.Count} wypożyczeń jako przeterminowane." });
        }
        
        [HttpPut("{id}/set-return-date")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> ReturnBorrow(int id)
        {
            var borrow = await _context.Borrows.FindAsync(id);
            if (borrow == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono wypożyczenia." } });

            if (borrow.BorrowStatus == BorrowStatus.Returned && borrow.BorrowStatus == BorrowStatus.ReturnedLate )
                return BadRequest(new ErrorResponse { Errors = new List<string> { "To wypożyczenie nie jest aktywne." } });

            borrow.ReturnDate = DateTime.Now;

            if (borrow.ReturnDate > borrow.TerminDate)
                borrow.BorrowStatus = BorrowStatus.ReturnedLate;
            else
                borrow.BorrowStatus = BorrowStatus.Returned;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Książka została zwrócona.", borrow.BorrowStatus });
        }
    }
}
