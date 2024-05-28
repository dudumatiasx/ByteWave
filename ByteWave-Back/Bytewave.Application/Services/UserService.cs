using Bytewave.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq; // Adicione esta linha
using System.Threading.Tasks;

namespace Bytewave.Application.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;

        public UserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await Task.Run(() => _userManager.Users);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username);
        }

        public async Task AddUserAsync(User user, string password)
        {
            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new System.Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task UpdateUserAsync(User user)
        {
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new System.Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
            }
        }

        public async Task DeleteUserAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    throw new System.Exception(string.Join("; ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
