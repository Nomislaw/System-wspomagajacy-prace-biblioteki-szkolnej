using Biblioteka.Api.DTOs;
using Biblioteka.Api.Models;

namespace Biblioteka.Api.Services;

public interface IUserService : IBaseService<User>
{
    Task<User> UpdateProfileAsync(int userId, UpdateUserDto dto);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    Task<User> ChangeUserRoleAsync(int userId, Role newRole);
}