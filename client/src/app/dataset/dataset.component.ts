import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Dataset } from 'src/app/_models/dataset';
import { DatasetService } from 'src/app/_services/dataset.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  dataset: Dataset | undefined;

  constructor(private datasetService: DatasetService, private toastr: ToastrService) { 
  }

  ngOnInit(): void {
    this.loadDataset();
    this.dataset = {
      id: 0,
      title: '',
      description: '',
      csvContent: ''
    }
  }

  loadDataset() {
    if (!this.dataset) return;
    this.datasetService.getDataset(this.dataset.id).subscribe({
      next: dataset => this.dataset = dataset
    })
  }

  createDataset() {
    this.datasetService.createDataset(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Dataset created successfully');
        this.editForm?.reset(this.dataset);
      }
    })
  }

  updateDataset() {
    this.datasetService.updateDataset(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Dataset updated successfully');
        this.editForm?.reset(this.dataset);
      }
    })
  }
}
