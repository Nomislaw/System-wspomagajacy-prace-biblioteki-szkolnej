namespace Biblioteka.Api.Models;

public class Borrow
{
    public int Id { get; set; }
    public int CopyId { get; set; }
    public virtual Copy Copy { get; set; } = null!;

    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;

    public DateTime BorrowDate { get; set; }
    public DateTime? ReturnDate { get; set; }
}