import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/saved-response/saved-response.component').then(c => c.SavedResponseComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/saved-response/saved-response.component').then(c => c.SavedResponseComponent) },

  //Sectors
  { path: 'sector', loadComponent: () => import('./pages/create-sector/create-sector.component').then(c => c.CreateSectorComponent) },
  { path: 'sector/:id', loadComponent: () => import('./pages/sector/sector.component').then(c => c.SectorComponent) },
  { path: 'sector/:id/edit', loadComponent: () => import('./pages/edit-sector/edit-sector.component').then(c => c.EditSectorComponent) },
  { path: 'sector/:id/add-subsector', loadComponent: () => import('./pages/create-subsector/create-subsector.component').then(c => c.CreateSubsectorComponent) },

  //Sectors
  { path: 'sub-sector', loadComponent: () => import('./pages/subsector/subsector.component').then(c => c.SubSectorComponent) },
  { path: 'sub-sector/:id', loadComponent: () => import('./pages/subsector/subsector.component').then(c => c.SubSectorComponent) },
  { path: 'sub-sector/:id/edit', loadComponent: () => import('./pages/edit-subsector/edit-subsector.component').then(c => c.EditSubSectorComponet) },
  { path: 'sector/:id/add-segment', loadComponent: () => import('./pages/create-segment/create-segment.component').then(c => c.CreateSegmentComponent) },

  

  //Segment
  { path: 'segment', loadComponent: () => import('./pages/subsector/subsector.component').then(c => c.SubSectorComponent) },
  { path: 'segment/:id', loadComponent: () => import('./pages/segment/segment.component').then(c => c.SegmentComponent) },
  { path: 'segment/:subSectorId/:id/edit', loadComponent: () => import('./pages/edit-segment/edit-segment.component').then(c => c.EditSegmentComponet) }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SectorsRoutingModule { }
