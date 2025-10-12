namespace Biblioteka.Api.Models;

public class Publisher
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public virtual ICollection<Book>? Books { get; set; }
}