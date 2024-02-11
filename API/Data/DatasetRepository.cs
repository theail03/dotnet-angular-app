using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DatasetRepository : IDatasetRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public DatasetRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddDataset(Dataset dataset)
        {
            _context.Datasets.Add(dataset);
        }

        public void UpdateDataset(Dataset dataset)
        {
            _context.Entry(dataset).State = EntityState.Modified;
        }

        public void DeleteDataset(Dataset dataset)
        {
            _context.Datasets.Remove(dataset);
        }

        public async Task<Dataset> GetDataset(int id)
        {
            return await _context.Datasets.FindAsync(id);
        }

        public async Task<PagedList<DatasetDto>> GetDatasetsForUser(DatasetParams datasetParams)
        {
            var query = _context.Datasets
                .OrderByDescending(dataset => dataset.Title)
                .AsQueryable();

            var messages = query.ProjectTo<DatasetDto>(_mapper.ConfigurationProvider);

            return await PagedList<DatasetDto>
                .CreateAsync(messages, datasetParams.PageNumber, datasetParams.PageSize);
        }
    }
}