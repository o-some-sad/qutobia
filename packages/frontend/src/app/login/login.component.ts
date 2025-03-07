import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserLogin } from '../interfaces/user-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  // providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  data: UserLogin = {
    email: '',
    password: '',
  };
  dataUser: any;
  medata:any
  constructor(private _auth: AuthService) {}
  login() {
    this._auth.login(this.data).subscribe((res) => {
      this.dataUser = res;
    });
  }
  mefn() {
    this._auth.me().subscribe()
  }
}
