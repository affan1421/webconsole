import { SchoolDashboardComponent } from './../growon/school-dashboard/school-dashboard.component';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { SchooldashComponent } from '../growon/create/schooldash/schooldash.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: SchoolDashboardComponent
      },
    ]),
    // ng-bootstrap modules
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
  ],
  providers: [],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule {
}
