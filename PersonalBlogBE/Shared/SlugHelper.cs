using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace PersonalBlogBE.Shared
{
    public class SlugHelper
    {
        public static string GenerateSlug(string title)
        {
            // 1. Convert to lowercase
            title = title.ToLowerInvariant();

            // 2. Remove Vietnamese accents
            string normalized = title.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();
            foreach (char c in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }
            title = sb.ToString().Normalize(NormalizationForm.FormC);

            // 3. Remove special characters and replace spaces with hyphens
            title = Regex.Replace(title, @"[^a-z0-9\s-]", "");      // Remove invalid chars
            title = Regex.Replace(title, @"\s+", "-");              // Replace whitespace with -
            title = Regex.Replace(title, @"-+", "-").Trim('-');     // Remove duplicate - and trim

            // 4. Append 5 random alphanumeric characters
            var random = Path.GetRandomFileName().Replace(".", "").Substring(0, 5);

            return $"{title}-{random}";
        }
    }
}
