using System.Security.Claims;
using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Biblioteka.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Biblioteka.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> GetReservations()
    {
        var reservations = await _context.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BookId = r.BookId,
                BookTitle = r.Book.Title,
                UserId = r.UserId,
                UserName = r.User.FirstName + "  " + r.User.LastName,
                ReservationDate = r.ReservationDate,
                ExpirationDate = r.ExpirationDate,
                ReservationStatus = r.ReservationStatus
            })
            .ToListAsync();

        return Ok(reservations);
    }
    [HttpGet("user")]
    [Authorize]
    public async Task<IActionResult> GetAllUserReservations()
    {
        var userId = GetCurrentUserId();

        var reservations = await _context.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .Select(r => new ReservationDto
            {
                Id = r.Id,
                BookId = r.BookId,
                BookTitle = r.Book.Title,
                UserId = r.UserId,
                UserName = r.User.FirstName + "  " + r.User.LastName,
                ReservationDate = r.ReservationDate,
                ExpirationDate = r.ExpirationDate,
                ReservationStatus = r.ReservationStatus
            })
            .ToListAsync();

        return Ok(reservations);
    }

    
    [HttpPost("{bookId}")]
    [Authorize]
    public async Task<IActionResult> ReserveBook(int bookId)
    {
        var userId = GetCurrentUserId();
        
        var activeReservationsCount = await _context.Reservations
            .CountAsync(r => r.UserId == userId && r.ReservationStatus == ReservationStatus.Active);

        if (activeReservationsCount >= 2)
        {
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Osiągnięto limit 2 aktywnych rezerwacji." } });
        }


        var book = await _context.Books.FindAsync(bookId);
        if (book == null || book.GetAvailableQuantity() <= 0)
            return BadRequest("Książka niedostępna");

        var existingReservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId && r.ReservationStatus == ReservationStatus.Active);

        if (existingReservation != null)
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Zarezerwowałęś już tę książkę." } });

        var reservation = new Reservation
        {
            BookId = bookId,
            UserId = userId,
            ReservationStatus = ReservationStatus.Active,
            ReservationDate = DateTime.Now,
            ExpirationDate = DateTime.Now.AddDays(7)
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return Ok(new {message = "Zarezerwowano książkę."});
    }
    
    [HttpPut("{bookId}/cancel-user")]
    [Authorize]
    public async Task<IActionResult> CancelReservationUser(int bookId)
    {
        var userId = GetCurrentUserId();
    
        var reservation = await _context.Reservations
            .FirstOrDefaultAsync(r => r.BookId == bookId && r.UserId == userId && r.ReservationStatus == ReservationStatus.Active);
    
        if (reservation == null)
            return NotFound(new ErrorResponse { Errors = new List<string> { "Rezerwacja nie istnieje." } });
    
        reservation.ReservationStatus = ReservationStatus.Canceled;
        await _context.SaveChangesAsync();
    
        return Ok(new {message = "Anulowano rezerwację."});
    }

    [HttpPut("{id}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelReservation(int id)
    {
        var userId = GetCurrentUserId();
        var isLibrarian = User.IsInRole("Librarian");
        
        var reservation = await _context.Reservations
            .FirstOrDefaultAsync( r => r.Id == id && r.ReservationStatus == ReservationStatus.Active);
        if (reservation == null) return NotFound();
        
        if (reservation.UserId != userId && !isLibrarian)
            return Forbid();

        reservation.ReservationStatus = ReservationStatus.Canceled;
        await _context.SaveChangesAsync();
        return Ok(new {message = "Anulowano rezerwację."});
    }

    [HttpPost("{reservationId}/convert")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> ConvertToBorrow(int reservationId)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == reservationId);

        if (reservation == null) return NotFound(new ErrorResponse { Errors = new List<string> { "Nie znaleziono rezerwacji" } });

        if (reservation.ReservationStatus != ReservationStatus.Active)
            return BadRequest(new ErrorResponse { Errors = new List<string> { "Rezerwacja nie jest aktywna" } });

        var borrow = new Borrow
        {
            BookId = reservation.BookId,
            UserId = reservation.UserId,
            BorrowDate = DateTime.Now,
            TerminDate = DateTime.Now.AddDays(14),
            ReturnDate = null,
            ReservationId = reservation.Id
        };

        reservation.ReservationStatus = ReservationStatus.Completed;
        _context.Borrows.Add(borrow);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Utworzono wypożyczenie." });
    }
    private int GetCurrentUserId()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new Exception("Nie udało się pobrać ID użytkownika z tokena");
    
        return int.Parse(userIdClaim.Value);
    }
}
