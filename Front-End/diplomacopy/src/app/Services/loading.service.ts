import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  Observable,
} from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {}

  public get isLoading(): Observable<boolean> {
    return this.isLoading$;
  }

  public interceptRouteChanges(): void {
    this.router.events
      .pipe(
        distinctUntilChanged(),
        filter(
          (event): boolean =>
            event instanceof NavigationStart || event instanceof NavigationEnd,
        ),
      )
      .subscribe((event): void => {
        if (event instanceof NavigationStart) {
          this._startLoading();
        } else if (event instanceof NavigationEnd) {
          this._stopLoading();
        }
      })
      .add(() => {
        this._stopLoading();
      });
  }

  public toggleIsLoading(isLoading: boolean): void {
    this.isLoading$.next(isLoading);
  }

  private _startLoading(): void {
    this.toggleIsLoading(true);
  }

  private _stopLoading(): void {
    setTimeout((): void => {
      this.toggleIsLoading(false);
    }, 500);
  }
}
