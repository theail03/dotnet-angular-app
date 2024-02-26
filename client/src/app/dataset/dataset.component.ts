import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Dataset } from 'src/app/_models/dataset';
import { DatasetService } from 'src/app/_services/dataset.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @ViewChild('tabset') tabset!: TabsetComponent;
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
  csvRows: any[] = [];
  csvHeaders: string[] = [];
  mode: string = 'create';

  constructor(private route: ActivatedRoute, private datasetService: DatasetService, private toastr: ToastrService, private router: Router) { 
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.data['mode'];
    if (id) {
      if (mode === 'view') {
        this.title = 'View Dataset';
        this.mode = 'view';
      } else if (mode === 'edit') {
        this.title = 'Edit Dataset';
        this.mode = 'edit';
      }
      this.route.data.subscribe(data => {
        this.dataset = data['dataset'];
      }); 
    } else {
      if (mode === 'viewCsv') {
        this.title = 'View CSV';
        this.mode = 'viewCsv';
      }
    }
    this.parseCsvContent();
  }

  ngAfterViewInit(): void {
    // Using setTimout to avoid "Expression has changed after it was checked" error
    setTimeout(() => {
      if (this.mode === 'view' && this.tabset.tabs) {
        // The second tab is the "View" tab
        const viewTabIndex = 1;
        this.tabset.tabs[viewTabIndex].active = true;
      }
    });
  }

  parseCsvContent(): void {
    const parsedCsv = d3.csvParse(this.dataset.csvContent);
    this.csvRows = parsedCsv;
  
    if (parsedCsv.length > 0) {
      this.csvHeaders = Object.keys(parsedCsv[0]);
    } else {
      this.csvHeaders = [];
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
