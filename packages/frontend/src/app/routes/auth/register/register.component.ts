import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
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
    const toast_id = toast.loading('Registering...');
    this._AuthService
      .register({
        name: this.handleRegister.value.name,
        email: this.handleRegister.value.email,
        password: this.handleRegister.value.password,
      })
      .subscribe({
        next: (_) => {
          this.isLoading = false;
          toast.success('Registered successfully, please check your email to verify your account', { id: toast_id });
          this._Router.navigate(['login']);
        },
        error: (err) => {
          // this.errMessage = err.error.message;
          this.isLoading = false;
          toast.warning(err.error.message, { id: toast_id });
        },
        complete: () => {},
      });
  }
  login(){
    this._Router.navigate(['login']);
  }
}


