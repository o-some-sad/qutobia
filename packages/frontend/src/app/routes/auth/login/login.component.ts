import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
register() {
  this._Router.navigate(['register'])
}
  isLoading:boolean=false;
 handelLogin:FormGroup=new FormGroup({
 email:new FormControl(null,[Validators.email,Validators.required]),
 password:new FormControl(null,[Validators.required,Validators.minLength(8)]),
 
 });
 constructor(private _authService:AuthService,private _Router:Router){
   console.log(this.handelLogin);
 }
  errMessage:string=''
 login():void{
   this._authService.login(this.handelLogin.value).subscribe({
    next: (value) => {
        this.isLoading=false;
        this._Router.navigate(['/dashboard/orders'])
    },
    error: (err) => {
      this.errMessage=err.error.message;
      this.isLoading=false;
    },
    complete: () => {
        
    },
  })
 }
  
}
