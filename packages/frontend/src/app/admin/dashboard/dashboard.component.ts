import {Component, OnInit} from '@angular/core';
import { DashboardItem } from '../../interfaces/dashboard.interface';
import {TitleCasePipe} from "@angular/common";
import { Router } from '@angular/router';
import {DashboardService} from "../../services/dashboard.service";

@Component({
  selector: 'app-dashboard',
    imports: [
        TitleCasePipe
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
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
    this.router.navigate([`/${type}`]).then();
  }
}
