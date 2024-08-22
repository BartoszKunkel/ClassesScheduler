import { Component } from "@angular/core";
import { SidenavService } from "../sidenav/sidenav.service";
import { map, take } from "rxjs";
import { AsyncPipe, NgIf } from "@angular/common";
import { AuthService } from "../../../Auth/auth.service";

@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: "./topbar.component.html",
  styleUrl: "./topbar.component.scss",
})
export class TopbarComponent {
  public isOpen$ = this.sidenavService.sidenavOpen;
  public isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private readonly sidenavService: SidenavService,
    private readonly authService: AuthService,
  ) {}

  public toggleSidenav(): void {
    this.sidenavService.sidenavOpen
      .pipe(
        take(1),
        map((open: boolean) => !open),
      )
      .subscribe((open) => this.sidenavService.toggleSidenav(open));
  }

  public logout() {
    this.authService.logout();
  }
}
