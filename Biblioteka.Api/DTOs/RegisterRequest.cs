using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class RegisterRequest
{
    [Required]
    [PasswordCheck(MinDigits = 3, MinLength = 8)]
    public string Password { get; set; } = "";

    [Required]
    public string FirstName { get; set; } = "";

    [Required]
    public string LastName { get; set; } = "";

    [Required]
    [EmailAddress(ErrorMessage = "Niepoprawny adres e-mail.")]
    public string Email { get; set; } = "";
}