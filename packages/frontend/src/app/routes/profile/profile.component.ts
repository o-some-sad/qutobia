import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../../interfaces/user.interface';
import {confirmPasswordValidator} from '../../validations/confirm-password.validator';
import {UserService} from '../../services/user.service';
import {toast} from 'ngx-sonner';
import {AuthService} from '../../services/auth.service';
import {NgClass} from '@angular/common';
import {SharedService} from '../../services/shared.service';

@Component({
  selector: 'app-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;
  originalName: string = '';
  originalImage: string | null = null;
  selectedImage: string | ArrayBuffer | null = null;
  allowedExtensions = ['jpg', 'png', 'jpeg'];
  maxFileSize = 1024 * 1024;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', Validators.required],
    }, { validators: confirmPasswordValidator });
  }
  ngOnInit(): void {
    this.authService.me().subscribe(res=>{
      this.user = res;
      this.originalName = this.user.name;
      this.originalImage = this.user.image;
      this.profileForm.patchValue({name: this.user.name});
    });
  }

  get profileFormControls():{ [key: string]: AbstractControl } {
    return this.profileForm.controls;
  }
  get passwordFormControls():{ [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }

  updateProfile() {
    if (this.profileForm.valid){
      const updatedData = this.profileForm.value;
      updatedData._id = this.user._id;
      const toast_id = toast.loading('Updating name...');
      this.userService.updateUser(updatedData).subscribe({
        next: (_) => {
          toast.success('Profile updated successfully', { id: toast_id });
        },
        error: (_) => {
          toast.error('Failed to update profile', { id: toast_id });
          this.profileForm.reset({ name: this.originalName });
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
  changePassword() {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value;
      passwordData._id = this.user._id;
      const toast_id = toast.loading('Updating password...');
      this.userService.changePassword(passwordData).subscribe({
        next: (_) => {
          toast.success('Password updated successfully', { id: toast_id });
          this.passwordForm.reset();
        },
        error: (err) => {
          toast.error(err.error.message, { id: toast_id });
          this.passwordForm.reset();
        }
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  openFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if(!fileExtension || !this.allowedExtensions.includes(fileExtension)){
        toast.warning('Invalid file format. Please upload a JPG, PNG, or JPEG file.');
        return;
      }
      if(file.size>this.maxFileSize){
        toast.warning('File size should be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result || null;
      };
      reader.readAsDataURL(file);
      this.uploadImage(file);
    }
  }
  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('image', file);
    const toast_id = toast.loading('Uploading image...');

    this.userService.uploadImage(this.user._id, formData).subscribe({
      next: (res) => {
        toast.success('Image uploaded successfully', { id: toast_id });
        this.user.image = res.data.image;
        this.originalImage = res.data.image;
        this.sharedService.updateUserImage(this.user.image!);
      },
      error: (_) => {
        toast.error('Failed to upload image', { id: toast_id });
        this.selectedImage = this.originalImage;
        this.user.image = this.originalImage;
      },
    });
  }
}
