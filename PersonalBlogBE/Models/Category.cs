using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalBlogBE.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }

        [Required]
        public string Slug { get; set; }

        [Required]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<Post> Posts { get; set; } 
    }
}
