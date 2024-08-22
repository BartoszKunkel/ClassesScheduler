import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from '../../Components/Bootstrap/toast/toast.service';
import { JwtPayload } from "../../Data/JwtPayload";
import { LoadingService } from '../../Services/loading.service';

export const authHighGuard: CanActivateFn = () => {
  const cookiesService = inject(CookieService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const toastService = inject(ToastService);
 
  const token =  cookiesService.get('token');

  const decodedToken: JwtPayload = jwtDecode(token);
  loadingService.toggleIsLoading(true);
  if(decodedToken.accesslvl < 4){
    if (!cookiesService.check("token")) {
      router.navigateByUrl("/autoryzacja").then(() => {
        setTimeout(() => {
          loadingService.toggleIsLoading(false);
        }, 700);
        toastService.showDanger("Brak dostępu musisz się zalogować");
        return false;
      });
    }else{
      router.navigateByUrl("/kalendarz").then(() =>{
        setTimeout(() => {
          loadingService.toggleIsLoading(false);
          toastService.showDanger("Brak dostępu");
          return false;
        })
      })
     }
  }
    return true;
  
}
