import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module'
import { AppComponent } from './app.component';
import { MemoryComponent } from './memory/memory.component';
import { LandingComponent } from './landing/landing.component';
import { MenuComponent } from './menu/menu.component';
import { InfoComponent } from './info/info.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    MemoryComponent,
    LandingComponent,
    MenuComponent,
    InfoComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
