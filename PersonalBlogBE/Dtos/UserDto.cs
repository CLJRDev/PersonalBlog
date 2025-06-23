using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace PersonalBlogBE.Dtos
{
    public class UserDto
    {
        [Required]
        public string Username { get; set; }

        [ValidateNever]
        public string Password { get; set; }

        [ValidateNever]
        public string ConfirmPassword { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string FullName { get; set; }
        
        [ValidateNever] //Khắc phục việc tự động binding trường này và yêu cầu required.
        public IFormFile Image { get; set; }

        [Required]
        public bool IsAdmin { get; set; }
    }
}
