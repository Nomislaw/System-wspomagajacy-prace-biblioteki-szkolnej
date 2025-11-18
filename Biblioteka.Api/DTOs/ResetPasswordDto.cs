using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class ResetPasswordDto
{
    public string Token { get; set; }
    [Required]
    [PasswordCheck(MinDigits = 3, MinLength = 8)]
    public string NewPassword { get; set; }
}