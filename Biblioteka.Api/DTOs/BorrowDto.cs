using Biblioteka.Api.Models;

namespace Biblioteka.Api.DTOs;

public class BorrowDto
{
    public int Id { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime BorrowDate { get; set; }
    public DateTime? TerminDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public BorrowStatus BorrowStatus { get; set; }
}