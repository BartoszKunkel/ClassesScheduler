import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { SidenavService } from "../Components/MyComponents/sidenav/sidenav.service";
import { ToastService } from "../Components/Bootstrap/toast/toast.service";
import { HttpService } from "../Services/http.service";
import { Login } from "../Data/Login";
import { JwtPayload } from "../Data/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { nextDay } from "date-fns";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly tokenName = "token";
  private loggedIn$ = new BehaviorSubject<boolean>(
    this.cookieService.check(this.tokenName),
  );
  
  private token;
  
  public accesslvl;
  public name;
  public lastName;
  constructor(
    private httpService: HttpService,
    private readonly cookieService: CookieService,
    private readonly router: Router,
    private readonly sidenavService: SidenavService,
    private readonly toastService: ToastService,
  ) {}


  login(credentials: Login) {
   
    this.httpService.login(credentials).subscribe(response =>
      {
        const currentDate = new Date();
        this.cookieService.set(this.tokenName, response['token'], {
             expires: new Date(currentDate.getTime() + 24*60*60*1000),
             secure: true,
           });
           console.log(response);
           setTimeout(() => {}, 700);
           window.location.reload();   
      },
      (error) =>
      {
        this.toastService.showDanger("Niepoprawde dane logowania");
        console.log(error);
      }
      )

   
  }

  logout() {
    this.router.navigateByUrl("/autoryzacja").then(() => {
      this.cookieService.delete(this.tokenName);
      this.loggedIn$.next(this.cookieService.check(this.tokenName));
      this.sidenavService.toggleSidenav(false);
      window.location.reload();
      this.toastService.showSuccess("Wylogowano pomyslnie");
      console.log("Logged out successfully");
    });
   
    
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getToken(): string | undefined {
    return this.cookieService.get(this.tokenName);
  }
}
