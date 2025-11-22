using System.Security.Claims;
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
                .Include(b => b.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .Include(b => b.User)
                .ThenInclude(b=>b.SchoolClass)
                .Select(b => new BorrowDto
                {
                    Id = b.Id,
                    BookId = b.BookCopy.BookId,
                    BookTitle = b.BookCopy.Book.Title,
                    BookCopyId = b.BookCopyId,
                    UserId = b.UserId,
                    UserName = b.User.FirstName + " " + b.User.LastName + (" " + (b.User.SchoolClass != null ? b.User.SchoolClass.ClassName : "")),
                    BorrowDate = b.BorrowDate,
                    TerminDate = b.TerminDate,
                    ReturnDate = b.ReturnDate,
                    BorrowStatus = b.BorrowStatus
                })
                .ToListAsync();

            return Ok(borrows);
        }
        [HttpGet("user")]
        [Authorize]
        public async Task<IActionResult> GetAllUserBorrows()
        {
            var userId = GetCurrentUserId();

            var borrows = await _context.Borrows
                .Include(b => b.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .Select(b => new BorrowDto
                {
                    Id = b.Id,
                    BookId = b.BookCopy.BookId,
                    BookTitle = b.BookCopy.Book.Title,
                    BookCopyId = b.BookCopyId,
                    UserId = b.UserId,
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
        [Authorize(Roles="Librarian")]
        public async Task<IActionResult> UpdateBorrowStatus(int id, [FromBody] BorrowStatus newStatus)
        {
            var borrow = await _context.Borrows.FirstOrDefaultAsync(r => r.Id == id);
            if (borrow == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono wypożyczenia." } });

            if (borrow.BorrowStatus == newStatus)
                return BadRequest(new ErrorResponse { Errors = new List<string> { "Wypożyczenie już ma ten status." } });

            borrow.BorrowStatus = newStatus;
            
            if (newStatus == BorrowStatus.Canceled)
            {
                var bookCopy = await _context.BookCopies.FirstOrDefaultAsync(b => b.Id == borrow.BookCopyId);
                bookCopy.IsAvailable = true;
            }
            
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Status wypożyczenia został zmieniony na {newStatus}." });
        }
        
        [HttpPut("{id}/set-return-date")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> ReturnBorrow(int id)
        {
            var borrow = await _context.Borrows.FirstOrDefaultAsync(r => r.Id == id);
            
            if (borrow == null)
                return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono wypożyczenia." } });

            if (borrow.BorrowStatus == BorrowStatus.Returned && borrow.BorrowStatus == BorrowStatus.ReturnedLate )
                return BadRequest(new ErrorResponse { Errors = new List<string> { "To wypożyczenie nie jest aktywne." } });

            borrow.ReturnDate = DateTime.Now;

            if (borrow.ReturnDate > borrow.TerminDate)
                borrow.BorrowStatus = BorrowStatus.ReturnedLate;
            else
                borrow.BorrowStatus = BorrowStatus.Returned;
            
            var bookCopy = await _context.BookCopies.FirstOrDefaultAsync(b => b.Id == borrow.BookCopyId);
            bookCopy.IsAvailable = true;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Książka została zwrócona.", borrow.BorrowStatus });
        }
        private int GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new Exception("Nie udało się pobrać ID użytkownika z tokena");
    
            return int.Parse(userIdClaim.Value);
        }
    }
}
