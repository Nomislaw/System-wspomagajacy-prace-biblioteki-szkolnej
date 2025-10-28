using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class UpdateUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; }
    
}