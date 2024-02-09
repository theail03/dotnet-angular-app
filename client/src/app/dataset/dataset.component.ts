import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Dataset } from 'src/app/_models/dataset';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
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
  user: User | null = null;

  constructor(private accountService: AccountService, private datasetService: DatasetService, 
      private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
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
