import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from '../app.component';
import { LandingComponent } from '../landing/landing.component';
import { MemoryComponent } from '../memory/memory.component';

const appRoutes: Routes = [
  { path: '', component: MemoryComponent},
  { path: 'landing', component: LandingComponent},
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