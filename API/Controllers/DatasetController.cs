using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DatasetController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _uow;
        public DatasetController(IMapper mapper, IUnitOfWork uow)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<DatasetDto>> CreateDataset(DatasetDto datasetDto)
        {
            var dataset = _mapper.Map<Dataset>(datasetDto);

            dataset.AppUserId = User.GetUserId();

            _uow.DatasetRepository.AddDataset(dataset);

            if (await _uow.Complete()) return Ok(_mapper.Map<DatasetDto>(dataset));

            return BadRequest("Failed to create dataset");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDataset(DatasetDto datasetDto)
        {
            var dataset = await _uow.DatasetRepository.GetDataset(datasetDto.Id);

            if (dataset == null) return NotFound();
            if (dataset.AppUserId != User.GetUserId()) return Forbid();

            _mapper.Map(datasetDto, dataset);

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Failed to update dataset");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DatasetDto>> GetDataset(int id)
        {
            var dataset = await _uow.DatasetRepository.GetDataset(id);
            
            if (dataset == null) return NotFound(); 
            if (dataset.AppUserId != User.GetUserId()) return Forbid();

            var datasetDto = _mapper.Map<DatasetDto>(dataset);
            
            return Ok(datasetDto); 
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<DatasetDto>>> GetDatasets([FromQuery]
            DatasetParams datasetParams)
        {
            datasetParams.UserId = User.GetUserId();

            var datasets = await _uow.DatasetRepository.GetDatasets(datasetParams);

            Response.AddPaginationHeader(new PaginationHeader(datasets.CurrentPage, datasets.PageSize, 
                datasets.TotalCount, datasets.TotalPages));
            
            return datasets;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDataset(int id)
        {
            var dataset = await _uow.DatasetRepository.GetDataset(id);

            if (dataset == null) return NotFound();
            if (dataset.AppUserId != User.GetUserId()) return Forbid();

            _uow.DatasetRepository.DeleteDataset(dataset);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting the dataset");

        }
    }
}
