import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [AppComponent, HomeComponent, HeaderComponent, SidenavListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    AuthModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
    ]),
  ],
  providers: [AuthService, UIService, Store],
  bootstrap: [AppComponent]
})
export class AppModule {}
