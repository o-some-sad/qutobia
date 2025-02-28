import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


fetch('/api/hello').then(console.log)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
