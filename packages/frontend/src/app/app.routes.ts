import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';

export const routes: Routes = [];


if(isDevMode()){
    routes.push({
        path: 'preview',
        component: PreviewComponent
    })
}