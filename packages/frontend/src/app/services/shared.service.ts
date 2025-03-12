import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userImageSubject = new BehaviorSubject<string>('');
  userImage$ = this.userImageSubject.asObservable();
  updateUserImage(imageUrl: string){
    this.userImageSubject.next(imageUrl);
  }

  private userLoggedSubject = new BehaviorSubject<User>({} as User);
  userLogged$ = this.userLoggedSubject.asObservable();
  setUserLogged(user: User){
    this.userLoggedSubject.next(user);
  }
}
