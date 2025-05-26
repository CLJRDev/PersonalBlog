using System.ComponentModel.DataAnnotations;

namespace PersonalBlogBE.Dto
{
    public class PostDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Slug { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public bool IsPublished { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int AuthorId { get; set; }

        public IFormFile Image { get; set; }
    }
}
