import { Component } from "@angular/core";
import { AuthService } from "../../Auth/auth.service";
import { Router } from "@angular/router";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Login } from "../../Data/Login";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject } from "rxjs";
import { ToastService } from "../../Components/Bootstrap/toast/toast.service";

@Component({
  selector: "app-view-auth",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./view-auth.component.html",
  styleUrl: "./view-auth.component.scss",
})
export class ViewAuthComponent {
  public authForm = new FormGroup({
    login: new FormControl<string>("", [Validators.required]),
    password: new FormControl<string>("", [Validators.required]),
  });
  private loggedIn$ = new BehaviorSubject<boolean>(
    this.cookieService.check('token'),
  );
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit(): void{
    if(this.cookieService.check('token')){
      this.router.navigateByUrl("/kalendarz").then(() => {
        this.loggedIn$.next(this.cookieService.check('token'));
        this.toastService.showSuccess("Zalogowano pomyslnie");
        console.log("Logged in successfully");
      });
    }
  }

  public submit(): void {
    if (this.authForm.invalid) {
      console.log("Form invalid!");
      return;
    }
   
    let login: Login = new Login();
    login.login = this.authForm.get('login').value;
    login.password = this.authForm.get('password').value;
    
    this.authService.login(login);
  
  }
}
