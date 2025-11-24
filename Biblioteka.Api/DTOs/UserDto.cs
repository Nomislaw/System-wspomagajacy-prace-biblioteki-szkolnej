using Biblioteka.Api.Models;

namespace Biblioteka.Api.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ClassName { get; set; }
    public Role Role { get; set; }
}