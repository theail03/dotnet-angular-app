import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dataset } from '../_models/dataset';
import { DatasetParams } from '../_models/datasetParams';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  baseUrl = environment.apiUrl;
  datasets: Dataset[] = [];
  datasetCache = new Map();
  dataset: Dataset | undefined;
  datasetParams = new DatasetParams();

  constructor(private http: HttpClient) {
  }

  getDatasetParams() {
    return this.datasetParams;
  }

  setDatasetParams(params: DatasetParams) {
    this.datasetParams = params;
  }

  resetDatasetParams() {
    this.datasetParams = new DatasetParams();
    return this.datasetParams;
  }

  getDatasets(datasetParams: DatasetParams) {
    const response = this.datasetCache.get(Object.values(datasetParams).join('-'));

    if (response) return of(response);

    let params = getPaginationHeaders(datasetParams.pageNumber, datasetParams.pageSize);

    params = params.append('orderBy', datasetParams.orderBy);

    return getPaginatedResult<Dataset[]>(this.baseUrl + 'dataset', params, this.http).pipe(
      map(response => {
        this.datasetCache.set(Object.values(datasetParams).join('-'), response);
        return response;
      })
    )
  }

  getDataset(id: number) {
    const dataset = [...this.datasetCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((dataset: Dataset) => dataset.id === id);

    if (dataset) return of(dataset);

    return this.http.get<Dataset>(this.baseUrl + 'dataset/' + id);
  }

  createDataset(dataset: Dataset) {
    return this.http.post<Dataset>(this.baseUrl + 'dataset', dataset).pipe(
      map((newDataset) => {
        this.datasets = [...this.datasets, newDataset];
        return newDataset;
      })
    )
  }

  updateDataset(dataset: Dataset) {
    return this.http.put(this.baseUrl + 'dataset', dataset).pipe(
      map(() => {
        const index = this.datasets.indexOf(dataset);
        this.datasets[index] = { ...this.datasets[index], ...dataset }
      })
    )
  }

}
