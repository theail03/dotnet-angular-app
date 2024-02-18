import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatasetService } from '../_services/dataset.service';
import { Dataset } from '../_models/dataset';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dataset-card',
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.css']
})
export class DatasetCardComponent implements OnInit {
  @Input() dataset: Dataset | undefined;
  @Input() predicate: string | undefined;
  svgImageUrl: any;

  constructor(private datasetService: DatasetService, private toastr: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.svgImageUrl = this.getSvgImage();
  }

  getSvgImage(): any {
    if (!this.dataset?.csvContent) {
      return '';
    }

    // Split the CSV content by new line
    const lines = this.dataset.csvContent.split('\n');

    // Start an SVG element
    let svgStart = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">`;
    let svgContent = '';

    const baseX = 5; 
    const baseY = 10; 
    const lineHeight = 6; 
    const fontSize = 5; 

    // Loop over each line of the CSV and add a text element for each
    lines.forEach((line, index) => {
      const yPosition = baseY + index * lineHeight;
      svgContent += `<text x="${baseX}" y="${yPosition}" font-family="Verdana" font-size="${fontSize}" fill="black">${line}</text>`;
    });

    // Close the SVG tag
    let svgEnd = `</svg>`;

    // Combine the parts into a full SVG string
    const svgData = `${svgStart}${svgContent}${svgEnd}`;

    // Convert SVG string to data URL
    const dataUrl = 'data:image/svg+xml;base64,' + window.btoa(svgData);

    // Sanitize the URL for Angular to trust it as a safe resource URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

  addLike(dataset: Dataset) {
    alert('Like button clicked');
  }

}
