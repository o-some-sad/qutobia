import { Component, OnInit } from '@angular/core';
import { DashboardItem } from '../../../interfaces/dashboard.interface';
import { TitleCasePipe } from "@angular/common";
import { Router, RouterOutlet } from '@angular/router';
import { DashboardService } from "../../../services/dashboard.service";

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private dashboardService: DashboardService, private router: Router) { }

  expanded = true

  toggleSide(){
    this.expanded = !this.expanded
  }
}
