using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string Name { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;

        public string GoogleId { get; set; }
        public string PhotoUrl { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}