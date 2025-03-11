import { AfterViewInit, Component, ContentChild, ElementRef, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { DashboardItem } from '../../../interfaces/dashboard.interface';
import { CommonModule, TitleCasePipe } from "@angular/common";
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DashboardService } from "../../../services/dashboard.service";
import { IconsModule } from '../../../modules/icons/icons.module';
import { filter } from 'rxjs';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    IconsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  constructor(private dashboardService: DashboardService, private router: Router, private elementRef: ElementRef<HTMLElement>, public headerService: HeaderService) { }

  ngAfterViewInit(): void {
  }


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
