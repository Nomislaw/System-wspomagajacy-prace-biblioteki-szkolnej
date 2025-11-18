using System.ComponentModel.DataAnnotations;

namespace Biblioteka.Api.DTOs;

public class PasswordCheck : ValidationAttribute
{
    public int MinDigits { get; set; } = 3;
    public int MinLength { get; set; } = 8;

    public override bool IsValid(object? value)
    {
        if (value == null) return false;
        var password = value.ToString() ?? "";

        if (password.Length < MinLength)
        {
            ErrorMessage = $"Hasło musi mieć co najmniej {MinLength} znaków.";
            return false;
        }

        if (password.Count(char.IsDigit) < MinDigits)
        {
            ErrorMessage = $"Hasło musi zawierać co najmniej {MinDigits} cyfry.";
            return false;
        }

        if (!password.Any(char.IsUpper))
        {
            ErrorMessage = "Hasło musi zawierać co najmniej jedną wielką literę.";
            return false;
        }

        if (!password.Any(ch => "!@#$%^&*(),.?\"{}|<>".Contains(ch)))
        {
            ErrorMessage = "Hasło musi zawierać co najmniej jeden znak specjalny.";
            return false;
        }

        return true;
    }
}