import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
  }),
  FlatpickrModule.forRoot()),
  FormsModule,
  provideHttpClient(withFetch())
  ]
  };
