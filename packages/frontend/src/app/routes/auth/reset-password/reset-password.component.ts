import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserInputComponent} from '../../../components/user-input/user-input.component';
import {confirmPasswordValidator} from '../../../validations/confirm-password.validator';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {toast} from 'ngx-sonner';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    UserInputComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  userId : string = '';
  resetPasswordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private activatedRouter: ActivatedRoute) {
    this.userId = this.activatedRouter.snapshot.params['userId'];
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: [''],
    }, { validators: confirmPasswordValidator });
  }
  get resetPasswordFormControls():{ [key: string]: FormControl } {
    return this.resetPasswordForm.controls as { [key: string]: FormControl };
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const toast_id = toast.loading('Updating password...');
      this.authService.resetPassword(this.userId, this.resetPasswordForm.value.newPassword).subscribe({
        next: (res) => {
          toast.success("Password updated successfully", {id: toast_id});
          const navigationExtras: NavigationExtras = {
            queryParams: { email: res.email }
          };

          this.location.replaceState('/login');
          this.router.navigate(['/login'], navigationExtras).then();
        },
        error: (err) => {
          toast.error(err.error.message, {id: toast_id});
        }
      });
    }
  }
}
