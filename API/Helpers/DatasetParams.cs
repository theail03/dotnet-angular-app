namespace API.Helpers
{
    public class DatasetParams : PaginationParams
    {
        public string OrderBy { get; set; } = "title";
    }
}