﻿using System.ComponentModel.DataAnnotations;

namespace PersonalBlogBE.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string FullName { get; set; }

        public IFormFile Image { get; set; }
    }
}
