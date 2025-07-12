using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace PersonalBlogBE.Dto
{
    public class PostDto
    {
        [Required]
        public string Title { get; set; }

        [ValidateNever] //Khắc phục việc tự động binding trường này và yêu cầu required.
        public string Slug { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public string CategoryId { get; set; }

        [Required]
        public string AuthorId { get; set; }

        [ValidateNever]
        public IFormFile Image { get; set; }
    }
}
