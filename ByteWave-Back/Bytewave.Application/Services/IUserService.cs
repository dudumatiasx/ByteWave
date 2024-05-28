using Bytewave.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bytewave.Application.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByUsernameAsync(string username);
        Task AddUserAsync(User user, string password);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string username);
    }
}
