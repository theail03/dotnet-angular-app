namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository {get;}
        IDatasetRepository DatasetRepository {get;}
        Task<bool> Complete();
        bool HasChanges();
    }
}