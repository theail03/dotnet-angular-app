import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmService } from '../_services/confirm.service';
import { DatasetComponent } from '../dataset/dataset.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<DatasetComponent> {
  constructor(private confirmService: ConfirmService) {}

  canDeactivate(component: DatasetComponent): Observable<boolean> {
    if (component.editForm?.dirty) {
      return this.confirmService.confirm();
    }
    return of(true);
  }
  
}
