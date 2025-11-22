using Biblioteka.Api.Models;

namespace Biblioteka.Api.DTOs;

public class BorrowDto
{
    public int Id { get; set; }
    public int  BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public int BookCopyId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime BorrowDate { get; set; }
    public DateTime? TerminDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public BorrowStatus BorrowStatus { get; set; }
}