import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Dataset } from '../_models/dataset';
import { DatasetService } from '../_services/dataset.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetResolver implements Resolve<Dataset> {
  constructor(private datasetService: DatasetService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Dataset> {
    const id = route.paramMap.get('id');
    return this.datasetService.getDataset(+id!);
  }
}
