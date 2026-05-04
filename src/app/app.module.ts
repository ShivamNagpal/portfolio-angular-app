import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NavBarComponent, FooterComponent],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideMarkdown(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
