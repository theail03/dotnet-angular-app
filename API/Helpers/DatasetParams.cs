namespace API.Helpers
{
    public class DatasetParams : PaginationParams
    {
        public int UserId { get; set; }
        public string Predicate { get; set; }
    }
}