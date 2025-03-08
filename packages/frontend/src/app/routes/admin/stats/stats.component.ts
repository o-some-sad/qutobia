import { Component } from '@angular/core';
import { DashboardItem } from '../../../interfaces/dashboard.interface';
import { DashboardService } from '../../../services/dashboard.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [TitleCasePipe],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
data: DashboardItem[];
  constructor(private dashboardService: DashboardService, private router: Router) {
    this.data = [];
  }
  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(res => {
      this.data = res;
    });
  }
  navigateToPage(type: string): void {
    this.router.navigate([`/dashboard/${type}`]).then();
  }
}
