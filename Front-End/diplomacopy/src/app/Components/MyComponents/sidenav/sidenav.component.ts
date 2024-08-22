import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { SidenavService } from "./sidenav.service";
import { AsyncPipe, CommonModule, NgOptimizedImage } from "@angular/common";
import { Subscription } from "rxjs";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../Auth/auth.service";
import { getISODay } from "date-fns";
import { CookieService } from "ngx-cookie-service";
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from "../../../Data/JwtPayload";

@Component({
  selector: "app-sidenav",
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    NgbTooltip,
    CommonModule
  ],
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.scss",
})
export class SidenavComponent {
  @Output() public sidenavWidth = new EventEmitter<number>();
  public isOpen$ = this.sidenavService.sidenavOpen;
  public isLoggedIn$ = this.authService.isLoggedIn();
  public email;
  @ViewChild("sidenav", { read: ElementRef })
  protected readonly sidenav: ElementRef<HTMLElement>;
  private readonly isOpenSubscription: Subscription;

  constructor(
    private readonly sidenavService: SidenavService,
    private readonly authService: AuthService,
    private readonly cookieService: CookieService
  ) {

    this.isOpenSubscription = this.isOpen$.subscribe((isOpen: boolean) => {
      console.log(this.email);
      if (isOpen) {
        setTimeout(() => {
          const width = this.sidenav.nativeElement.offsetWidth;
          this.sidenavWidth.emit(width);
        }, 500);
      } else {
        this.sidenavWidth.emit(0);
      }
    });
  }
  ngOnInit(){
    if(this.cookieService.check('token')){
           const token = this.cookieService.get('token');
           const decodedToken: JwtPayload = jwtDecode(token);
           this.email = "Witaj " + decodedToken.firstName + " " + decodedToken.lastName;
    }
  }
  ngOnDestroy(): void {
    if (this.isOpenSubscription) {
      this.isOpenSubscription.unsubscribe();
    }
  }
}
