using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersonalBlogBE.Models
{
    public class Comment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Required]
        public string PostId { get; set; }
        public Post Post { get; set; }

        [Required, Column(TypeName = "nvarchar(100)")]
        public string UserName { get; set; }

        [Required, Column(TypeName = "nvarchar(1000)")]
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
