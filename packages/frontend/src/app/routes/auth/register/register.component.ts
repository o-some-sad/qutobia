import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRegister } from '../../../interfaces/user-register';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { any } from 'zod';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoading: boolean = false;
  errMessage: string = '';

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  handleRegister: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.minLength(8),
        Validators.required,
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      role: new FormControl('user'),
    },
    this.passwordMatchValidator
  );
  passwordMatchValidator(g: any) {
    return g.get('password')?.value === g.get('passwordConfirm')?.value
      ? null
      : { mismatch: true };
  }

  register() {
    this.isLoading = true;
    this._AuthService
      .register({
        name: this.handleRegister.value.name,
        email: this.handleRegister.value.email,
        password: this.handleRegister.value.password,
      })
      .subscribe({
        next: (value) => {
          this.isLoading = false;
          this._Router.navigate(['login']);
        },
        error: (err) => {
          this.errMessage = err.error.message;
          toast.error(this.errMessage);
          this.isLoading = false;
        },
        complete: () => {},
      });
  }
  login(){
    this._Router.navigate(['login']);
  }
}


