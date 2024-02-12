using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class DatasetDto
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public string CsvContent { get; set; }
    }
}
