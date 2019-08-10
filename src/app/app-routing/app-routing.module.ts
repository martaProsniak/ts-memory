import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { MemoryComponent } from '../memory/memory.component';

const appRoutes: Routes = [
  { path: '', component: LandingComponent},
  { path: 'game', component: MemoryComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }