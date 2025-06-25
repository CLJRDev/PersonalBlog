using System.ComponentModel.DataAnnotations;

namespace PersonalBlogBE.Dtos
{
    public class CategoryDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Slug { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
