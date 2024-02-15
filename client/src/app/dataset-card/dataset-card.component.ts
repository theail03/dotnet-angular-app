import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatasetService } from '../_services/dataset.service';
import { Dataset } from '../_models/dataset';

@Component({
  selector: 'app-dataset-card',
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.css']
})
export class DatasetCardComponent implements OnInit {
  @Input() dataset: Dataset | undefined;

  constructor(private datasetService: DatasetService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  addLike(dataset: Dataset) {
    alert('Like button clicked');
  }

}
