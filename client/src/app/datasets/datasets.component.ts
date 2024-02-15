import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/pagination';
import { DatasetService } from '../_services/dataset.service';
import { DatasetParams } from '../_models/datasetParams';
import { Dataset } from '../_models/dataset';

@Component({
  selector: 'app-lists',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {
  datasets: Dataset[] | undefined;
  predicate = 'public';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination | undefined;

  constructor(private datasetService: DatasetService) { }

  ngOnInit(): void {
    this.loadDatasets();
  }

  loadDatasets() {
    const params = new DatasetParams();
    this.datasetService.getDatasets(params).subscribe({
      next: response => {
        this.datasets = response.result;
        this.pagination = response.pagination;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadDatasets();
    }
  }

}
