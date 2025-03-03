import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';
import { IndexComponent } from './routes/index/index.component';

export const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
        title: "Kotobia - Home"
    }
];


if(isDevMode() || true){
    routes.push({
        path: 'preview',
        component: PreviewComponent
    })
}