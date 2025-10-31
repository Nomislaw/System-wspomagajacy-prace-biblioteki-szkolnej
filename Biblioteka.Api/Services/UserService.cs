using System.ComponentModel.DataAnnotations;
using Biblioteka.Api.Data;
using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Biblioteka.Api.Services;

public class UserService : BaseService<User>, IUserService
{
 
    private readonly PasswordHasher<User> _passwordHasher = new();

    public UserService(AppDbContext context) : base(context)
    {

    }

    public async Task<User> UpdateProfileAsync(int userId, UpdateUserDto dto)
    {
        var user = await GetByIdAsync(userId);
        if (user == null) return null;

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;

        await UpdateAsync(user);
        return user;
    }
    
    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await GetByIdAsync(userId);
        if (user == null) return false;

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, dto.OldPassword);

        if (verificationResult == PasswordVerificationResult.Failed)
            return false;
        
        user.Password = _passwordHasher.HashPassword(user, dto.NewPassword);

        await UpdateAsync(user);
        return true;
    }
    
    public async Task<User> ChangeUserRoleAsync(int userId, Role newRole)
    {
        var user = await GetByIdAsync(userId);
        if (user == null) return null;

        user.Role = newRole;
        await UpdateAsync(user);
        return user;
    }
}


