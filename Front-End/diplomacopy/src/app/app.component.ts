import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TopbarComponent } from "./Components/MyComponents/topbar/topbar.component";
import { SidenavComponent } from "./Components/MyComponents/sidenav/sidenav.component";
import { AsyncPipe, NgIf } from "@angular/common";
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  of,
  startWith,
} from "rxjs";
import { LoadingService } from "./Services/loading.service";
import { ScreenLoaderComponent } from "./Components/MyComponents/screen-loader/screen-loader.component";
import { FooterComponent } from "./Components/MyComponents/footer/footer.component";
import { ToastComponent } from "./Components/Bootstrap/toast/toast.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    TopbarComponent,
    SidenavComponent,
    AsyncPipe,
    ScreenLoaderComponent,
    NgIf,
    FooterComponent,
    ToastComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  public readonly title = "diploma";
  public sidenavWidth = 0;
  public isLoading$ = this.loadingService.isLoading;
  private readonly desktopBreakpoint = 1200;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.interceptRouteChanges();
  }

  public isDesktop(): Observable<boolean> {
    if (typeof window !== "undefined") {
      return fromEvent(window, "resize").pipe(
        debounceTime(500),
        map(() => this.getScreenSize()),
        distinctUntilChanged(),
        startWith(this.getScreenSize()),
      );
    }

    return of(false);
  }

  private getScreenSize(): boolean {
    return window.innerWidth > this.desktopBreakpoint;
  }
}
