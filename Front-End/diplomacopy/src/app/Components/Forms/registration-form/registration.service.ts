import { Injectable, EventEmitter} from '@angular/core';
import { Login } from '../../../Data/Login';
import { HttpService } from '../../../Services/http.service';
import { Observable, take, map, BehaviorSubject } from "rxjs";
import { Registration } from '../../../Data/Registration';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private _register$ = new BehaviorSubject<Registration[]>([]);
  public emitter: EventEmitter<any> = new EventEmitter();
  constructor(private readonly httpService: HttpService) {}

  public getRegistration$(): Observable<Registration[]> {
    return this._register$.asObservable();
  }

  public updateRegistration$(): void {
    this.httpService
      .getRegister()
      .pipe(take(1))
      .subscribe((updatedRegister) => {
        this._register$.next(updatedRegister);
      });
  }
}
