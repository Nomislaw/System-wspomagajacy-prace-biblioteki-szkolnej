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
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("user-activity")]
        [Authorize(Roles = "Librarian, Teacher")]
        public async Task<IActionResult> GenerateUserReport(DateTime? fromDate, DateTime? toDate, int? classId)
        {
            var userId = GetCurrentUserId();
            var user = _context.Users.First(u => u.Id == userId);
            
            if (user.Role == Role.Teacher)
            {
                classId = user.SchoolClassId;
            }
            
            var borrowsQuery = _context.Borrows
                .Include(b => b.BookCopy)
                    .ThenInclude(bc => bc.Book)
                .Include(b => b.User)
                .AsQueryable();

            var reservationsQuery = _context.Reservations
                .Include(r => r.Book)
                .Include(r => r.User)
                .AsQueryable();

            if (fromDate.HasValue)
            {
                borrowsQuery = borrowsQuery.Where(b => b.BorrowDate >= fromDate.Value);
                reservationsQuery = reservationsQuery.Where(r => r.ReservationDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                borrowsQuery = borrowsQuery.Where(b => b.BorrowDate <= toDate.Value);
                reservationsQuery = reservationsQuery.Where(r => r.ReservationDate <= toDate.Value);
            }

            if (classId.HasValue)
            {
                borrowsQuery = borrowsQuery.Where(b => (b.User.SchoolClassId == classId.Value && b.User.Role == Role.Student));
                reservationsQuery = reservationsQuery.Where(r => (r.User.SchoolClassId == classId.Value  && r.User.Role == Role.Student));
            }

            var borrowsDto = await borrowsQuery.Select(b => new ActivityRecordDto
            {
                Id = b.Id,
                BookTitle = b.BookCopy.Book.Title + " #" + b.BookCopyId,
                UserName = b.User.FirstName + " " + b.User.LastName,
                FromDate = b.BorrowDate,
                ToDate = b.TerminDate,
                ReturnDate = b.ReturnDate,
                Status = BorrowStatusToPolish(b.BorrowStatus),
                Type = "Wypożyczenie"
            }).ToListAsync();

            var reservationsDto = await reservationsQuery.Select(r => new ActivityRecordDto
            {
                Id = r.Id,
                BookTitle = r.Book.Title,
                UserName = r.User.FirstName + " " + r.User.LastName,
                FromDate = r.ReservationDate,
                ToDate = r.ExpirationDate,
                ReturnDate = null,
                Status = ReservationStatusToPolish(r.ReservationStatus),
                Type = "Rezerwacja"
            }).ToListAsync();
            
            var records = borrowsDto.Concat(reservationsDto)
                .OrderByDescending(x => x.FromDate)
                .ToList();
            
            var borrowStats = new
            {
                Total = borrowsDto.Count,
                Active = new
                {
                    Count = borrowsDto.Count(b => b.Status == "Aktywny"),
                    Percent = borrowsDto.Count > 0 ? borrowsDto.Count(b => b.Status == "Aktywny") * 100.0 / borrowsDto.Count : 0
                },
                Returned = new
                {
                    Count = borrowsDto.Count(b => b.Status == "Zwrócony"),
                    Percent = borrowsDto.Count > 0 ? borrowsDto.Count(b => b.Status == "Zwrócony") * 100.0 / borrowsDto.Count : 0
                },
                ReturnedLate = new
                {
                    Count = borrowsDto.Count(b => b.Status == "Zwrócony po terminie"),
                    Percent = borrowsDto.Count > 0 ? borrowsDto.Count(b => b.Status == "Zwrócony po terminie") * 100.0 / borrowsDto.Count : 0
                },
                Overdue = new
                {
                    Count = borrowsDto.Count(b => b.Status == "Opóźniony"),
                    Percent = borrowsDto.Count > 0 ? borrowsDto.Count(b => b.Status == "Opóźniony") * 100.0 / borrowsDto.Count : 0
                },
                Canceled = new
                {
                    Count = borrowsDto.Count(b => b.Status == "Anulowany"),
                    Percent = borrowsDto.Count > 0 ? borrowsDto.Count(b => b.Status == "Anulowany") * 100.0 / borrowsDto.Count : 0
                }
            };
            
            var reservationStats = new
            {
                Total = reservationsDto.Count,
                Active = new
                {
                    Count = reservationsDto.Count(r => r.Status == "Aktywny"),
                    Percent = reservationsDto.Count > 0 ? reservationsDto.Count(r => r.Status == "Aktywny") * 100.0 / reservationsDto.Count : 0
                },
                Completed = new
                {
                    Count = reservationsDto.Count(r => r.Status == "Zrealizowany"),
                    Percent = reservationsDto.Count > 0 ? reservationsDto.Count(r => r.Status == "Zrealizowany") * 100.0 / reservationsDto.Count : 0
                },
                Canceled = new
                {
                    Count = reservationsDto.Count(r => r.Status == "Anulowany"),
                    Percent = reservationsDto.Count > 0 ? reservationsDto.Count(r => r.Status == "Anulowany") * 100.0 / reservationsDto.Count : 0
                },
                Expired = new
                {
                    Count = reservationsDto.Count(r => r.Status == "Wygasły"),
                    Percent = reservationsDto.Count > 0 ? reservationsDto.Count(r => r.Status == "Wygasły") * 100.0 / reservationsDto.Count : 0
                }
            };
            
            var generalStats = new
            {
                TotalRecords = records.Count,
                TotalBorrows = borrowsDto.Count,
                TotalBorrowsPercent = records.Count > 0 ? borrowsDto.Count * 100.0 / records.Count : 0,
                TotalReservations = reservationsDto.Count,
                TotalReservationsPercent = records.Count > 0 ? reservationsDto.Count * 100.0 / records.Count : 0,
                TotalActive = borrowStats.Active.Count + reservationStats.Active.Count,
                TotalActivePercent = records.Count > 0 ? (borrowStats.Active.Count + reservationStats.Active.Count) * 100.0 / records.Count : 0,
                TotalCompleted = borrowStats.Returned.Count + reservationStats.Completed.Count,
                TotalCompletedPercent = records.Count > 0 ? (borrowStats.Returned.Count + reservationStats.Completed.Count) * 100.0 / records.Count : 0,
                TotalCanceled = borrowStats.Canceled.Count + reservationStats.Canceled.Count,
                TotalCanceledPercent = records.Count > 0 ? (borrowStats.Canceled.Count + reservationStats.Canceled.Count) * 100.0 / records.Count : 0
            };

            string className;

            if (classId.HasValue)
            {
                className = await _context.SchoolClasses
                    .Where(c => c.Id == classId.Value)
                    .Select(c => c.ClassName)
                    .FirstOrDefaultAsync() ?? "Nieznana klasa";
            }
            else
            {
                className = "Wszyscy";
            }

            return Ok(new
            {
                FromDate = fromDate,
                ToDate = toDate,
                ClassName = className,
                Records = records,
                Statistics = new
                {
                    Borrows = borrowStats,
                    Reservations = reservationStats,
                    Summary = generalStats
                }
            });
        }
        
        [HttpGet("book-state")]
        [Authorize(Roles = "Librarian")] 
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooksReport()
        {
            var books = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Category)
                .Include(b => b.Publisher)
                .Include(b=>b.Reservations)
                .Include(b=>b.BookCopies)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    ISBN = b.ISBN,
                    PublicationYear = b.PublicationYear,
                    Quantity = b.GetQuantity(),
                    Available = b.GetAvailableQuantity(),
                    AuthorName = b.Author.FirstName + " " + b.Author.LastName,
                    CategoryName = b.Category.Name,
                    PublisherName = b.Publisher.Name
                })
                .ToListAsync();

            return Ok(books);
        }
        private int GetCurrentUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new Exception("Nie udało się pobrać ID użytkownika z tokena");
    
            return int.Parse(userIdClaim.Value);
        }

        public static string BorrowStatusToPolish(BorrowStatus status)
        {
            return status switch
            {
                BorrowStatus.Active => "Aktywny",
                BorrowStatus.Returned => "Zwrócony",
                BorrowStatus.ReturnedLate => "Zwrócony po terminie",
                BorrowStatus.Canceled => "Anulowany",
                BorrowStatus.Overdue => "Opóźniony",
                _ => "Nieznany status"
            };
        }
        
        public static string ReservationStatusToPolish(ReservationStatus status)
        {
            return status switch
            {
                ReservationStatus.Active => "Aktywny",
                ReservationStatus.Completed => "Zrealizowany",
                ReservationStatus.Canceled => "Anulowany",
                ReservationStatus.Expired => "Wygasły",
                _ => "Nieznany status"
            };
        }


        
    }
}
