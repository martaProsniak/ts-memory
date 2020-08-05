import { MainPageComponent } from './../main-page/main-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { LandingComponent } from '../landing/landing.component';
import { MemoryComponent } from '../memory/memory.component';
import { InfoComponent } from '../info/info.component';
import { GameComponent } from './../game/game.component';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent},
  { path: 'game', component: GameComponent},
  { path: 'memory', component: MemoryComponent},
  { path: 'intro', component: LandingComponent},
  { path: 'info', component: InfoComponent},
  { path: '**', component: MainPageComponent}
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
