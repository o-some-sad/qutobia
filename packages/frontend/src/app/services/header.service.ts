import { Injectable, TemplateRef } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(router: Router) {
    // router.events.pipe(filter(event=>event instanceof NavigationStart)).subscribe({
    //   next: event=>{
    //     this.portal.next(null)
    //   }
    // })
  }


  portal = new Subject<TemplateRef<any> | null>();

  setPortal(ref: TemplateRef<any> | null) {
    setTimeout(() => {
      this.portal.next(ref); // emit in the next event loop
    });
  }

  
}
