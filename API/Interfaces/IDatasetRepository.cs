using API.DTOs;
using API.Entities;
using API.Helpers;
using Newtonsoft.Json.Linq;

namespace API.Interfaces
{
    public interface IDatasetRepository
    {
        void AddDataset(Dataset dataset);
        void DeleteDataset(Dataset dataset);
        Task<Dataset> GetDataset(int id);
        Task<PagedList<DatasetDto>> GetDatasetsForUser(DatasetParams datasetParams);
    }
}