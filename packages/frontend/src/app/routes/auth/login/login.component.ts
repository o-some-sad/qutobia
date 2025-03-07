import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserLogin } from '../../../interfaces/user-login';
import { date } from 'zod';
import { Observable } from 'rxjs';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  // providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isLoading: boolean = false;
  errMessage: string = '';
  handelLogin: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(private _authService: AuthService) {}

  login(): void {
    this.isLoading = true;
    this._authService.login(this.handelLogin.value).subscribe({
      next: (value) => {
        console.log(value);
        this.isLoading = false;
      },
      error: (err) => {
        this.errMessage = err.error.message;
        this.isLoading = false;
      },
    });
  }
}
