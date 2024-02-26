namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string GoogleId { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public string Name { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
    }
}