import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavOpen$ = new BehaviorSubject(false);

  public get sidenavOpen(): Observable<boolean> {
    return this.sidenavOpen$;
  }

  public toggleSidenav(value: boolean): void {
    this.sidenavOpen$.next(value);
  }
}
