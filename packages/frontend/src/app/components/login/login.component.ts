import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserLogin } from '../../interfaces/user-login';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  data:UserLogin={
    email:'',
    password:''
  }
  dataUser:any
constructor(private _auth:AuthService){
 
}
login(){
  
  
this._auth.login(this.data).subscribe(res => {
  this.dataUser = res;
});


}
}
