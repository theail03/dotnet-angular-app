namespace API.Entities
{
    public class Dataset
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CsvContent { get; set; }
    }
}
