import {toast} from 'ngx-sonner';
import { Location } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../../../services/shared.service';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  userId : string = '';
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private location: Location) {
    this.userId = this.activatedRouter.snapshot.params['userId'];
  }

  ngOnInit() {
    const toast_id = toast.loading('Verifying email...');
    this.authService.verifyEmail(this.userId).subscribe({
      next: (res) => {
        toast.success('Email verified successfully', { id: toast_id });
        this.sharedService.setUserLogged(res)
        this.location.replaceState('/');
        this.router.navigate(['/']).then();
      },
      error: (_) => {
        toast.error('Failed to verify email', { id: toast_id });
        this.location.replaceState('/');
        this.router.navigate(['/']).then();
      }
    });
  }
}
