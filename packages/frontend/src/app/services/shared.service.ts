import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userImageSubject = new BehaviorSubject<string>('');
  userImage$ = this.userImageSubject.asObservable();

  updateUserImage(imageUrl: string){
    this.userImageSubject.next(imageUrl);
  }
}
