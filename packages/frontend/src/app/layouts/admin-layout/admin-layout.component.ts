import { Component, ElementRef, inject } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconsModule } from '../../modules/icons/icons.module';
import { HeaderService } from '../../services/header.service';
import { AsyncPipe, CommonModule, NgTemplateOutlet } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, IconsModule, AsyncPipe, RouterLink, NgTemplateOutlet, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  headerService = inject(HeaderService)
  router = inject(Router)
  elementRef = inject(ElementRef<HTMLElement>)

    ngOnInit(): void {
      this.router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe(event => {
          const drawer = this.elementRef.nativeElement.querySelector("input[type=checkbox]#drawer") as HTMLInputElement | null;
          if (!drawer) return;
          drawer.checked = false
        })
    }
  
}
