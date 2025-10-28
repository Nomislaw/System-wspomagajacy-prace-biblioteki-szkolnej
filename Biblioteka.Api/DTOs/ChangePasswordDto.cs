using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class ChangePasswordDto
{
    public string OldPassword { get; set; }
    
    [Required]
    [MinLength(8, ErrorMessage = "Hasło musi mieć co najmniej 8 znaków.")]
    [RegularExpression(@"^(?=(?:.*\d){3,})(?=.*[!@#$%^&*(),.?""{}|<>])(?=.*[A-Z]).*$",
        ErrorMessage = "Hasło musi zawierać co najmniej 3 cyfry, 1 znak specjalny i 1 wielką literę.")]
    public string NewPassword { get; set; }
}