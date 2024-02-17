import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatasetService } from '../_services/dataset.service';
import { Dataset } from '../_models/dataset';
import { DomSanitizer } from '@angular/platform-browser';
import * as d3 from 'd3';

@Component({
  selector: 'app-dataset-card',
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.css']
})
export class DatasetCardComponent implements OnInit {
  @Input() dataset: Dataset | undefined;
  svgImageUrl: any;

  constructor(private datasetService: DatasetService, private toastr: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.svgImageUrl = this.getSvgImage();
  }

  getSvgImage(): any {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
      <!-- Add more SVG elements here as needed -->
    </svg>`;

    // Convert SVG string to data URL
    const dataUrl = 'data:image/svg+xml;base64,' + window.btoa(svgData);

    // Sanitize the URL for Angular to trust it as a safe resource URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  addLike(dataset: Dataset) {
    alert('Like button clicked');
  }

}
