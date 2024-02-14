import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Dataset } from 'src/app/_models/dataset';
import { DatasetService } from 'src/app/_services/dataset.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  title: string = 'Create Dataset';
  dataset: Dataset = {
    title: '',
    description: '',
    csvContent: '',
    isPublic: false
  };

  constructor(private route: ActivatedRoute, private datasetService: DatasetService, private toastr: ToastrService, private router: Router) { 
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.title = 'Edit Dataset';
      this.route.data.subscribe(data => {
        this.dataset = data['dataset'];
      }); 
    }
  }

  saveDataset() {
    const operation = this.dataset.id ? this.datasetService.updateDataset(this.dataset)
                                      : this.datasetService.createDataset(this.dataset);

    operation.subscribe({
      next: (dataset) => {
        const successMessage = this.dataset.id ? 'Dataset updated successfully' : 'Dataset created successfully';
        this.toastr.success(successMessage);
        this.editForm?.reset(this.dataset); 
        this.router.navigate(['/dataset', dataset.id]);
      },
      error: () => {
        const errorMessage = this.dataset.id ? 'Failed to update dataset' : 'Failed to create dataset';
        this.toastr.error(errorMessage);
      }
    });
  }
}
