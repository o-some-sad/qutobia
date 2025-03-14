import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../../../services/shared.service';
import {toast} from 'ngx-sonner';
import {
  ForgotPasswordDialogComponent
} from '../../../components/forgot-password-dialog/forgot-password-dialog.component';
import {IconsModule} from '../../../modules/icons/icons.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IconsModule, ForgotPasswordDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  errMessage: string = ''
  @ViewChild(ForgotPasswordDialogComponent) forgotPasswordDialog!: ForgotPasswordDialogComponent;
  handellogin: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
  });

  constructor(private _authService: AuthService, private _Router: Router, private sharedService: SharedService, private _ActivatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this._ActivatedRoute.queryParams.subscribe(params => {
      if (params['email']) this.handellogin.patchValue({email: params['email']});
    });
  }

  login(): void {
    this.isLoading = true;
    const toast_id = toast.loading('Logging in...');
    this._authService.login(this.handellogin.value).subscribe({
      next: (value) => {
        this.isLoading = false;
        toast.success('Logged in successfully', {id: toast_id});
        this.sharedService.setUserLogged(value.user);
        const returnUrl = this._ActivatedRoute.snapshot.queryParams['returnUrl'] || '/';
        this._Router.navigateByUrl(returnUrl).then();
      },
      error: (err) => {
        // this.errMessage=err.error.message;
        this.isLoading = false;
        toast.warning(err.error.message, {id: toast_id});
      },
      complete: () => {},
    })
  }
  register() {
    this._Router.navigate(['register']).then();
  }
  forgotPassword() {
    this.forgotPasswordDialog.openModal();
  }
}
