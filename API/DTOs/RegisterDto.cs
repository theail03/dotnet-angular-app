using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace API.DTOs
{
    public class RegisterDto
    {
        public string Username { get; set; }

        public string KnownAs { get; set; }
        public string Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; } // optional to make required work!
        public string City { get; set; }
        public string Country { get; set; }

        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }
        public string GoogleId { get; set; }
    }
}