namespace Biblioteka.Api.Models;

public class BookCopy
{
    public int Id { get; set; }
    public bool IsAvailable { get; set; }
    public string BarCode { get; set; }
    
    public int BookId { get; set; }
    public virtual Book Book { get; set; }
    
    public ICollection<Borrow>? Borrows { get; set; }
}