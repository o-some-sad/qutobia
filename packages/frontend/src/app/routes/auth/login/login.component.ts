import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  register() {
    this._Router.navigate(['register']);
  }
  isLoading: boolean = false;
  handellogin: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(
    private _authService: AuthService,
    private _Router: Router,
    private sharedService: SharedService,
    private _ActivatedRoute: ActivatedRoute
  ) {}
  errMessage: string = '';
  login(): void {
    this._authService.login(this.handellogin.value).subscribe({
      next: (value) => {
        this.isLoading = false;
        this.sharedService.setUserLogged(value.user);
        const returnUrl =
          this._ActivatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this._Router.navigateByUrl(returnUrl).then();
      },
      error: (err) => {
        this.errMessage = err.error.message;
        this.isLoading = false;
      },
      complete: () => {},
    });
  }
}
