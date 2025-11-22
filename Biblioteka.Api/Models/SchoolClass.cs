namespace Biblioteka.Api.Models;

public class SchoolClass
{
    public int Id { get; set;}
    public string ClassName { get; set; }
    public ICollection<User>? Users { get; set; }
}