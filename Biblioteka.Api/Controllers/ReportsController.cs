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
public class ReportsController : ControllerBase
{
  private readonly AppDbContext _context;
  public ReportsController(AppDbContext context)
  {
    _context = context;
  }
  
  [HttpGet("user-report")]
  [Authorize(Roles = "Librarian")]
public async Task<IActionResult> GenerateUserReport(DateTime fromDate, DateTime toDate, int? userId)
{
    if (fromDate > toDate)
        return BadRequest("Data początkowa nie może być późniejsza niż data końcowa.");
    
    var borrowsQuery = _context.Borrows
        .Include(b => b.Book)
        .Include(b => b.User)
        .Where(b => b.BorrowDate >= fromDate && b.BorrowDate <= toDate);
    
    var reservationsQuery = _context.Reservations
        .Include(r => r.Book)
        .Include(r => r.User)
        .Where(r => r.ReservationDate >= fromDate && r.ReservationDate <= toDate);
    
    if (userId.HasValue)
    {
        borrowsQuery = borrowsQuery.Where(b => b.UserId == userId.Value);
        reservationsQuery = reservationsQuery.Where(r => r.UserId == userId.Value);
    }
    
    var borrows = await borrowsQuery
        .OrderBy(b => b.BorrowDate)
        .Select(b => new BorrowDto
        {
            Id = b.Id,
            BookId = b.BookId,
            BookTitle = b.Book.Title,
            UserId = b.UserId,
            UserName = b.User.FirstName + " " + b.User.LastName,
            BorrowDate = b.BorrowDate,
            TerminDate = b.TerminDate,
            ReturnDate = b.ReturnDate,
            BorrowStatus = b.BorrowStatus
        })
        .ToListAsync();

    var reservations = await reservationsQuery
        .OrderBy(r => r.ReservationDate)
        .Select(r => new ReservationDto
        {
            Id = r.Id,
            BookId = r.BookId,
            BookTitle = r.Book.Title,
            UserId = r.UserId,
            UserName = r.User.FirstName + " " + r.User.LastName,
            ReservationDate = r.ReservationDate,
            ExpirationDate = r.ExpirationDate,
            ReservationStatus = r.ReservationStatus
        })
        .ToListAsync();
    
    var userName = userId.HasValue
        ? await _context.Users
            .Where(u => u.Id == userId.Value)
            .Select(u => u.FirstName + " " + u.LastName)
            .FirstOrDefaultAsync()
        : "Wszyscy użytkownicy";
    
    var reportData = new
    {
        FromDate = fromDate,
        ToDate = toDate,
        UserName = userName,
        Borrows = borrows,
        Reservations = reservations
    };

    return Ok(reportData);
}


}
