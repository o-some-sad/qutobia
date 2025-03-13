import {Component} from '@angular/core';
import {FeatherModule} from "angular-feather";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserInputComponent} from "../user-input/user-input.component";
import {AuthService} from '../../services/auth.service';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password-dialog',
  imports: [
    FeatherModule,
    FormsModule,
    ReactiveFormsModule,
    UserInputComponent
  ],
  templateUrl: './forgot-password-dialog.component.html',
  styleUrl: './forgot-password-dialog.component.css'
})
export class ForgotPasswordDialogComponent {
  isOpen = false;
  forgetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get forgetPasswordControls(): { [key: string]: FormControl } {
    return this.forgetPasswordForm.controls as { [key: string]: FormControl };
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.forgetPasswordForm.reset();
    this.isOpen = false;
  }

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const toast_id = toast.loading('loading...');
      this.authService.forgetPassword(this.forgetPasswordForm.value.email).subscribe({
        next: (_) => {
          toast.success('please check your email to reset your password', {id: toast_id});
          this.closeModal();
        },
        error: (_) => {
          toast.error('Failed to reset password', {id: toast_id});
        }
      });
    }
  }
}
