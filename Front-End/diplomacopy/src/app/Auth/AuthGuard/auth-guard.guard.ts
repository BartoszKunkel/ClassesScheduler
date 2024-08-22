import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { LoadingService } from "../../Services/loading.service";
import { ToastService } from "../../Components/Bootstrap/toast/toast.service";
import { AuthService } from "../auth.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  if (!cookieService.check("token")) {

    router.navigateByUrl("/autoryzacja").then(() => {
      setTimeout(() => {
        loadingService.toggleIsLoading(false);
      }, 700);
      toastService.showDanger("Brak dostępu");
      return false;
    });
  }

  return true;
};
