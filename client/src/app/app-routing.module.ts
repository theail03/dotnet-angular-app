import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './_guards/admin.guard';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { DatasetComponent } from './dataset/dataset.component';
import { DatasetResolver } from './_resolvers/dataset.resolver';
import { DatasetsComponent } from './datasets/datasets.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '', 
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
      {path: 'datasets', component: DatasetsComponent},
      {path: 'dataset/create', component: DatasetComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'dataset/:id', component: DatasetComponent, resolve: {dataset: DatasetResolver}, canDeactivate: [PreventUnsavedChangesGuard]},
      {path: 'dataset/:id/view', component: DatasetComponent, resolve: {dataset: DatasetResolver}, data: {mode: 'view'}},
    ]
  },
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
