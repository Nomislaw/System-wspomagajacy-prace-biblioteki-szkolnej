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
                BookTitle = r.Book.Title,
                UserName = r.User.FirstName + "  " + r.User.LastName,
                ReservationDate = r.ReservationDate,
                ExpirationDate = r.ExpirationDate,
                ReservationStatus = r.ReservationStatus
            })
            .ToListAsync();

        return Ok(reservations);
    }


    [HttpPut("{id}/cancel")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> CancelReservation(int id)
    {
        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null) return NotFound();

        reservation.ReservationStatus = ReservationStatus.Canceled;
        await _context.SaveChangesAsync();
        return Ok(reservation);
    }

    [HttpPost("convert/{reservationId}")]
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
    
    [HttpPut("update-expired")]
    [Authorize(Roles = "Librarian")]
    public async Task<IActionResult> MarkExpiredReservations()
    {
        var now = DateTime.Now;

        var overdue = await _context.Reservations
            .Where(b => b.ReservationStatus == ReservationStatus.Active && b.ExpirationDate < now)
            .ToListAsync();

        foreach (var b in overdue)
            b.ReservationStatus = ReservationStatus.Expired;

        await _context.SaveChangesAsync();

        return Ok(new { message = $"Zaktualizowano {overdue.Count} rezerwacji na przeterminowane." });
    }
}
