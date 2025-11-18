using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class ChangePasswordDto
{
    public string OldPassword { get; set; }
    
    [Required]
    [PasswordCheck(MinDigits = 3, MinLength = 8)]
    public string NewPassword { get; set; }
}