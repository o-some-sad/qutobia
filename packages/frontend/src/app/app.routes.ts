import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';
import { PreviewComponent } from './routes/preview/preview.component';

export const routes: Routes = [
    {
        path: 'cart',
        loadComponent: () => import('./routes/cart/cart.component').then(c => c.CartComponent)
    }
];


if (isDevMode()) {
    routes.push({
        path: 'preview',
        component: PreviewComponent
    })
}