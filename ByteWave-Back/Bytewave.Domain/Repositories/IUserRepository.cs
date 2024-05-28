using Bytewave.Domain.Entities;
using System.Threading.Tasks;

namespace Bytewave.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task AddUserAsync(User user);
    }
}
